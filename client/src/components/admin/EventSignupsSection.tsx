import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { getAllEvents } from "../../api/eventsApi";
import type { CreatedEvent, EventsByTime } from "../../api/eventsApi";
import {
  cancelTicket,
  getTicketsByEventID,
  promoteTicket,
  updateTicketAttendance,
} from "../../api/ticketsApi";
import type { EventSignup } from "../../api/ticketsApi";
import {
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  RefreshCw,
  Trash2,
  UsersRound,
} from "lucide-react";
import DataTable from "./DataTable";
import "../../style/admin.css";

function errorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  return error instanceof Error ? error.message : "Something went wrong.";
}

function memberName(row: EventSignup): string {
  return row.user
    ? `${row.user.firstName} ${row.user.lastName}`
    : "Deleted member";
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Pacific/Auckland",
  }).format(date);
}

export default function EventSignupsSection() {
  const [events, setEvents] = useState<EventsByTime | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        const data = await getAllEvents();
        if (active) setEvents(data);
      } catch (requestError) {
        if (active) setError(errorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadEvents();

    return () => {
      active = false;
    };
  }, [retry]);

  const allEvents = [...(events?.upcoming ?? []), ...(events?.past ?? [])];

  const selectedEvent = allEvents.find((event) => event._id === selectedId);

  return (
    <section className="admin-theme admin-event-signups">
      <div className="admin-event-picker">
        <div className="admin-picker-heading">
          <span className="admin-icon-tile">
            <CalendarDays aria-hidden="true" />
          </span>
          <div>
            <label className="admin-field-label" htmlFor="admin-event">
              Choose an event
            </label>
            <p className="admin-helper-text">
              View registrations for upcoming and past events.
            </p>
          </div>
        </div>

        <div className="admin-select-field">
          <select
            id="admin-event"
            className="admin-select"
            disabled={loading}
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            <option value="">
              {loading ? "Loading events…" : "Select an event"}
            </option>

            <optgroup label="Upcoming">
              {events?.upcoming.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title} — {formatDate(event.datetime)}
                </option>
              ))}
            </optgroup>

            <optgroup label="Past">
              {events?.past.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title} — {formatDate(event.datetime)}
                </option>
              ))}
            </optgroup>
          </select>
          <ChevronDown aria-hidden="true" />
        </div>

        {error && (
          <div role="alert" className="admin-error-notice">
            <p>{error}</p>
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => {
                setError(null);
                setLoading(true);
                setRetry((value) => value + 1);
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && !allEvents.length && (
          <p className="admin-helper-text">No events available.</p>
        )}
      </div>

      {selectedEvent ? (
        <EventRegistrations key={selectedEvent._id} event={selectedEvent} />
      ) : (
        <div className="admin-selection-empty">
          <UsersRound aria-hidden="true" />
          <h2>Select an event to get started</h2>
          <p>Its registrations, waitlist, and attendance will appear here.</p>
        </div>
      )}
    </section>
  );
}

function EventRegistrations({ event }: { event: CreatedEvent }) {
  const [registrations, setRegistrations] = useState<EventSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"confirmed" | "waitlisted">("confirmed");
  const [attendance, setAttendance] = useState<"all" | "yes" | "no">("all");
  const [now, setNow] = useState(() => Date.now());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toRemove, setToRemove] = useState<EventSignup | null>(null);

  const active = useRef(false);
  const requestNumber = useRef(0);
  const busy = useRef(false);

  const load = useCallback(async (): Promise<boolean> => {
    if (!active.current) return false;

    const request = ++requestNumber.current;

    try {
      const data = await getTicketsByEventID(event._id);

      if (!active.current || request !== requestNumber.current) {
        return false;
      }

      setRegistrations(data);
      setError(null);
      setNow(Date.now());

      return true;
    } catch (requestError) {
      if (active.current && request === requestNumber.current) {
        setError(errorMessage(requestError));
      }

      return false;
    } finally {
      if (active.current && request === requestNumber.current) {
        setLoading(false);
      }
    }
  }, [event._id]);

  useEffect(() => {
    active.current = true;
    const request = ++requestNumber.current;

    getTicketsByEventID(event._id)
      .then((data) => {
        if (active.current && request === requestNumber.current) {
          setRegistrations(data);
          setError(null);
          setNow(Date.now());
        }
      })
      .catch((requestError: unknown) => {
        if (active.current && request === requestNumber.current) {
          setError(errorMessage(requestError));
        }
      })
      .finally(() => {
        if (active.current && request === requestNumber.current) {
          setLoading(false);
        }
      });

    const clock = window.setInterval(() => setNow(Date.now()), 30_000);

    return () => {
      window.clearInterval(clock);
      active.current = false;
      requestNumber.current += 1;
    };
  }, [event._id]);

  const runAction = useCallback(
    async (
      ticketId: string,
      request: () => Promise<void>,
      successMessage: string
    ): Promise<boolean> => {
      if (busy.current) return false;

      busy.current = true;
      setPendingId(ticketId);

      try {
        await request();

        if (!active.current) return true;

        toast.success(successMessage);
        setLoading(true);
        setError(null);

        const refreshed = await load();

        if (!refreshed && active.current) {
          toast.error("Saved, but the list could not refresh. Click Refresh.");
        }

        return true;
      } catch (requestError) {
        if (active.current) {
          toast.error(errorMessage(requestError));
          setLoading(true);
          setError(null);
          await load();
        }

        return false;
      } finally {
        busy.current = false;
        if (active.current) setPendingId(null);
      }
    },
    [load]
  );

  const confirmed = useMemo(
    () => registrations.filter((row) => row.status === "confirmed"),
    [registrations]
  );

  const waiting = useMemo(
    () =>
      registrations
        .filter((row) => row.status === "waitlisted")
        .sort((a, b) => {
          const time =
            new Date(a.waitlistedAt ?? a.registeredAt).getTime() -
            new Date(b.waitlistedAt ?? b.registeredAt).getTime();

          return time || a._id.localeCompare(b._id);
        })
        .map((row, index) => ({
          ...row,
          waitlistPosition: index + 1,
        })),
    [registrations]
  );

  const attendedCount = confirmed.filter((row) => row.attended).length;

  const remaining =
    event.capacity == null
      ? null
      : Math.max(0, event.capacity - confirmed.length);

  const promotionOpen =
    (remaining === null || remaining > 0) &&
    new Date(event.datetime).getTime() > now &&
    (!event.releaseDatetime ||
      new Date(event.releaseDatetime).getTime() <= now);

  const rows =
    tab === "waitlisted"
      ? waiting
      : confirmed.filter(
          (row) =>
            attendance === "all" ||
            (attendance === "yes" ? row.attended : !row.attended)
        );

  const columns = useMemo<ColumnDef<EventSignup>[]>(() => {
    const result: ColumnDef<EventSignup>[] = [
      {
        id: "name",
        header: "Name",
        accessorFn: memberName,
        cell: ({ row }) => (
          <span className="admin-member-name">{memberName(row.original)}</span>
        ),
      },
      {
        id: "email",
        header: "Email",
        accessorFn: (row) => row.user?.email ?? "",
        cell: ({ row }) =>
          row.original.user ? (
            <a
              className="admin-email-link"
              href={`mailto:${row.original.user.email}`}
            >
              {row.original.user.email}
            </a>
          ) : (
            "—"
          ),
      },
      {
        id: "registeredAt",
        header: tab === "waitlisted" ? "Joined" : "Registered",
        accessorFn: (row) =>
          tab === "waitlisted"
            ? (row.waitlistedAt ?? row.registeredAt)
            : row.registeredAt,
        enableGlobalFilter: false,
        cell: ({ getValue }) => formatDate(getValue<string>()),
      },
      {
        id: "details",
        header: "Details",
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => (
          <dl className="admin-registration-details">
            <div>
              <dt>Diet</dt>
              <dd>{row.original.dietaryRequirements}</dd>
            </div>
            <div>
              <dt>Buddy</dt>
              <dd>{row.original.groupBuddy}</dd>
            </div>
          </dl>
        ),
      },
    ];

    if (tab === "waitlisted") {
      result.unshift({
        id: "waitlistPosition",
        header: "Position",
        accessorFn: (row) => row.waitlistPosition ?? 0,
        enableGlobalFilter: false,
        cell: ({ getValue }) => (
          <span className="admin-position-badge">#{getValue<number>()}</span>
        ),
      });
    } else {
      result.push({
        id: "attended",
        header: "Attended",
        accessorKey: "attended",
        enableGlobalFilter: false,
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="admin-attendance-checkbox"
            checked={row.original.attended}
            disabled={pendingId !== null}
            aria-label={`Attendance for ${memberName(row.original)}`}
            onChange={(change) => {
              const attended = change.target.checked;

              void runAction(
                row.original._id,
                () =>
                  updateTicketAttendance(event._id, row.original._id, attended),
                "Attendance saved."
              );
            }}
          />
        ),
      });
    }

    result.push({
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <div className="admin-row-actions">
          {tab === "waitlisted" && (
            <button
              type="button"
              className="admin-promote-button"
              title={
                !row.original.user
                  ? "This member no longer has an account."
                  : row.original.waitlistPosition !== 1
                    ? "Promote the first person on the waitlist before this member."
                    : !promotionOpen
                      ? "A place must be available and registration must be open."
                      : "Confirm the next person on the waitlist."
              }
              disabled={
                pendingId !== null ||
                row.original.waitlistPosition !== 1 ||
                !promotionOpen ||
                !row.original.user
              }
              onClick={() => {
                void runAction(
                  row.original._id,
                  () => promoteTicket(event._id, row.original._id),
                  "Registration confirmed."
                );
              }}
            >
              <ArrowUp aria-hidden="true" />
              Promote
            </button>
          )}

          <button
            type="button"
            className="admin-remove-button"
            disabled={pendingId !== null}
            onClick={() => setToRemove(row.original)}
          >
            <Trash2 aria-hidden="true" />
            Remove
          </button>
        </div>
      ),
    });

    return result;
  }, [tab, pendingId, runAction, event._id, promotionOpen]);

  return (
    <div className="admin-registrations">
      <div className="admin-event-summary">
        <div className="admin-event-summary-content">
          <h2>{event.title}</h2>
          <div className="admin-event-metadata">
            <span>
              <CalendarDays aria-hidden="true" />
              {formatDate(event.datetime)}
            </span>
            <span>
              <UsersRound aria-hidden="true" />
              Capacity: {event.capacity ?? "Unlimited"}
            </span>
          </div>
        </div>
        <span className="admin-availability-badge">
          {loading && !registrations.length
            ? "Checking places…"
            : remaining === null
              ? "Unlimited places"
              : `${remaining} ${remaining === 1 ? "place" : "places"} available`}
        </span>
      </div>

      <div className="admin-stats">
        {[
          { label: "Confirmed", count: confirmed.length, icon: CheckCircle2 },
          { label: "Waitlisted", count: waiting.length, icon: Clock3 },
          { label: "Attended", count: attendedCount, icon: ClipboardCheck },
        ].map(({ label, count, icon: Icon }) => (
          <div key={label} className="admin-stat-card">
            <span className="admin-icon-tile">
              <Icon aria-hidden="true" />
            </span>
            <span className="admin-stat-label">{label}</span>
            <span className="admin-stat-value">
              {loading && !registrations.length ? "—" : count}
            </span>
          </div>
        ))}
      </div>

      {toRemove && (
        <div
          className="admin-removal-notice"
          role="alert"
          aria-labelledby="remove-registration-title"
        >
          <div>
            <p id="remove-registration-title" className="admin-notice-title">
              Remove {memberName(toRemove)} from {event.title}?
            </p>

            <p className="admin-helper-text">
              {toRemove.status === "confirmed"
                ? "This frees a place. Promote the next person manually."
                : "This removes their place on the waitlist."}
            </p>
          </div>

          <div className="admin-confirmation-actions">
            <button
              type="button"
              className="admin-secondary-button"
              disabled={pendingId !== null}
              onClick={() => setToRemove(null)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="admin-danger-button"
              disabled={pendingId !== null}
              onClick={() => {
                const ticketId = toRemove._id;

                void runAction(
                  ticketId,
                  () => cancelTicket(event._id, ticketId),
                  "Registration removed."
                ).then((saved) => {
                  if (saved && active.current) setToRemove(null);
                });
              }}
            >
              {pendingId === toRemove._id ? "Removing…" : "Confirm removal"}
            </button>
          </div>
        </div>
      )}

      <DataTable
        key={tab}
        initialPageSize={10}
        toolbar={
          <>
            <div className="admin-registration-toolbar">
              <div
                className="admin-tab-list"
                role="group"
                aria-label="Registration list"
              >
                {(["confirmed", "waitlisted"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={tab === value}
                    className="admin-tab-button"
                    onClick={() => {
                      setTab(value);
                      setAttendance("all");
                    }}
                  >
                    {value === "confirmed" ? "Confirmed" : "Waitlist"}
                    <span className="admin-tab-count">
                      {loading && !registrations.length
                        ? "—"
                        : value === "confirmed"
                          ? confirmed.length
                          : waiting.length}
                    </span>
                  </button>
                ))}
              </div>
              <div className="admin-toolbar-actions">
                {tab === "confirmed" && (
                  <div className="admin-select-field">
                    <select
                      aria-label="Filter attendance"
                      className="admin-select"
                      value={attendance}
                      onChange={(change) =>
                        setAttendance(
                          change.target.value as "all" | "yes" | "no"
                        )
                      }
                    >
                      <option value="all">All attendance</option>
                      <option value="yes">Attended</option>
                      <option value="no">Not checked in</option>
                    </select>
                    <ChevronDown aria-hidden="true" />
                  </div>
                )}
                <button
                  type="button"
                  className="admin-secondary-button"
                  disabled={loading || pendingId !== null}
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    void load();
                  }}
                >
                  <RefreshCw
                    aria-hidden="true"
                    className={loading ? "admin-spinning" : undefined}
                  />
                  {loading ? "Refreshing…" : "Refresh"}
                </button>
              </div>
            </div>
            {tab === "waitlisted" && (
              <p className="admin-waitlist-hint">
                <Clock3 aria-hidden="true" />
                Places are offered in waitlist order. Promote the first member
                when a place is available and registration is open.
              </p>
            )}
          </>
        }
        columns={columns}
        data={rows}
        getRowId={(row) => row._id}
        isLoading={loading}
        error={error}
        emptyTitle={
          (tab === "confirmed" ? confirmed : waiting).length
            ? "No matching registrations"
            : tab === "confirmed"
              ? "No confirmed registrations yet"
              : "The waitlist is empty"
        }
        emptyDescription={
          (tab === "confirmed" ? confirmed : waiting).length
            ? "Try changing your search or attendance filter."
            : tab === "confirmed"
              ? "Members will appear here once their registration is confirmed."
              : "Members will appear here when the event reaches capacity."
        }
        searchPlaceholder="Search name or email"
        columnWidthClasses={
          tab === "confirmed"
            ? {
                name: "w-[18%]",
                email: "w-[22%]",
                registeredAt: "w-[17%]",
                details: "w-[19%]",
                attended: "w-[9%]",
                actions: "w-[15%]",
              }
            : {
                waitlistPosition: "w-[11%]",
                name: "w-[14%]",
                email: "w-[20%]",
                registeredAt: "w-[16%]",
                details: "w-[20%]",
                actions: "w-[19%]",
              }
        }
      />
    </div>
  );
}
