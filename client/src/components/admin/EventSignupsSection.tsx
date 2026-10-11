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
import DataTable from "./DataTable";

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

    const allEvents = [
        ...(events?.upcoming ?? []),
        ...(events?.past ?? []),
    ];

    const selectedEvent = allEvents.find(
        (event) => event._id === selectedId
    );

    return (
        <section className="flex min-w-0 flex-col gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <label
                    className="mb-2 block text-sm font-semibold"
                    htmlFor="admin-event"
                >
                    Event
                </label>

                <select
                    id="admin-event"
                    className="w-full rounded-md border border-slate-300 bg-white p-3 text-sm"
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

                {error && (
                    <div role="alert" className="mt-3 text-sm text-red-700">
                        <p>{error}</p>
                        <button
                            type="button"
                            className="admin-action-button"
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
                    <p className="mt-3 text-sm text-slate-600">
                        No events available.
                    </p>
                )}
            </div>

            {selectedEvent ? (
                <EventRegistrations
                    key={selectedEvent._id}
                    event={selectedEvent}
                />
            ) : (
                <p className="text-sm text-slate-600">
                    Select an event to view registrations.
                </p>
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
                    toast.error(
                        "Saved, but the list could not refresh. Click Refresh."
                    );
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
                    <span className="font-semibold text-slate-950">
                        {memberName(row.original)}
                    </span>
                ),
            },
            {
                id: "email",
                header: "Email",
                accessorFn: (row) => row.user?.email ?? "",
                cell: ({ row }) =>
                    row.original.user ? (
                        <a
                            className="break-all text-blue-medium"
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
                        ? row.waitlistedAt ?? row.registeredAt
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
                    <div className="space-y-1 break-words text-xs">
                        <p>Diet: {row.original.dietaryRequirements}</p>
                        <p>Buddy: {row.original.groupBuddy}</p>
                    </div>
                ),
            },
        ];

        if (tab === "waitlisted") {
            result.unshift({
                id: "waitlistPosition",
                header: "Position",
                accessorFn: (row) => row.waitlistPosition ?? 0,
                enableGlobalFilter: false,
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
                        className="h-4 w-4"
                        checked={row.original.attended}
                        disabled={pendingId !== null}
                        aria-label={`Attendance for ${memberName(row.original)}`}
                        onChange={(change) => {
                            const attended = change.target.checked;

                            void runAction(
                                row.original._id,
                                () =>
                                    updateTicketAttendance(
                                        event._id,
                                        row.original._id,
                                        attended
                                    ),
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
                <div className="flex flex-col gap-2">
                    {tab === "waitlisted" && (
                        <button
                            type="button"
                            className="admin-action-button"
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
                            Promote
                        </button>
                    )}

                    <button
                        type="button"
                        className="admin-action-button"
                        disabled={pendingId !== null}
                        onClick={() => setToRemove(row.original)}
                    >
                        Remove
                    </button>
                </div>
            ),
        });

        return result;
    }, [tab, pendingId, runAction, event._id, promotionOpen]);

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-xl font-bold">{event.title}</h2>
                <p className="text-sm text-slate-600">
                    {formatDate(event.datetime)}
                </p>
                <p className="text-sm text-slate-600">
                    Capacity: {event.capacity ?? "Unlimited"}
                    {remaining !== null && ` · Available places: ${remaining}`}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                {[
                    ["Confirmed", confirmed.length],
                    ["Waitlisted", waiting.length],
                    ["Attended", attendedCount],
                ].map(([label, count]) => (
                    <div
                        key={label}
                        className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm"
                    >
                        <span className="text-sm font-semibold text-slate-600">
                            {label}
                        </span>
                        <span className="text-2xl font-bold text-blue-medium">
                            {count}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {(["confirmed", "waitlisted"] as const).map((value) => (
                    <button
                        key={value}
                        type="button"
                        aria-pressed={tab === value}
                        className={`rounded-md px-4 py-2 text-sm font-semibold ${tab === value
                            ? "bg-blue-medium text-white"
                            : "border border-slate-300 bg-white"
                            }`}
                        onClick={() => {
                            setTab(value);
                            setAttendance("all");
                        }}
                    >
                        {value === "confirmed" ? "Confirmed" : "Waitlist"}
                    </button>
                ))}

                {tab === "confirmed" && (
                    <select
                        aria-label="Filter attendance"
                        className="rounded-md border border-slate-300 bg-white p-2 text-sm"
                        value={attendance}
                        onChange={(change) =>
                            setAttendance(change.target.value as "all" | "yes" | "no")
                        }
                    >
                        <option value="all">All attendance</option>
                        <option value="yes">Attended</option>
                        <option value="no">Not checked in</option>
                    </select>
                )}

                <button
                    type="button"
                    className="admin-action-button"
                    disabled={loading || pendingId !== null}
                    onClick={() => {
                        setLoading(true);
                        setError(null);
                        void load();
                    }}
                >
                    Refresh
                </button>
            </div>

            {toRemove && (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 p-4"
                    aria-labelledby="remove-registration-title"
                >
                    <p id="remove-registration-title" className="font-semibold">
                        Remove {memberName(toRemove)} from {event.title}?
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                        {toRemove.status === "confirmed"
                            ? "This frees a place. Promote the next person manually."
                            : "This removes their place on the waitlist."}
                    </p>

                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            className="admin-action-button"
                            disabled={pendingId !== null}
                            onClick={() => setToRemove(null)}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="admin-action-button"
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
                            {pendingId === toRemove._id
                                ? "Removing…"
                                : "Confirm removal"}
                        </button>
                    </div>
                </div>
            )}

            <DataTable
                key={tab}
                columns={columns}
                data={rows}
                getRowId={(row) => row._id}
                isLoading={loading}
                error={error}
                emptyTitle={`No matching ${tab === "confirmed" ? "registrations" : "waitlist entries"
                    }`}
                emptyDescription="Try changing your search or filters."
                searchPlaceholder="Search name or email"
                columnWidthClasses={{
                    name: "w-[18%]",
                    email: "w-[22%]",
                    registeredAt: "w-[16%]",
                    details: "w-[20%]",
                    attended: "w-[8%]",
                    actions: "w-[16%]",
                    waitlistPosition: "w-[8%]",
                }}
            />
        </div>
    );
}