import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CalendarCheck,
  ChevronLeft,
  LockKeyhole,
  User,
} from "lucide-react";
import { useAuth } from "../auth/useAuth";
import createTicket, { getMyTicket } from "../api/ticketsApi";
import type { TicketRecord } from "../api/ticketsApi";
import type { EventRecord } from "./EventPageWrapper";
import { ImageBlock } from "../components/image_block/ImageBlock";
import "../style/common.css";

function message(error: unknown): string {
  if (typeof error === "string") return error;
  return error instanceof Error ? error.message : "Signup failed.";
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Pacific/Auckland",
  }).format(new Date(value));
}

export default function UpcomingEvent({
  event,
}: {
  event: EventRecord;
}) {
  const { id } = useParams<{ id: string }>();
  const { hasAccount, user } = useAuth();
  const accountId = user?.id;

  const [step, setStep] = useState(1);
  const [groupBuddy, setGroupBuddy] = useState("");
  const [dietaryRequirements, setDietaryRequirements] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const [registration, setRegistration] = useState<{
    eventId: string;
    accountId: string;
    ticket: TicketRecord | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (!id || !hasAccount || !accountId) return;

    let active = true;

    getMyTicket(id)
      .then((ticket) => {
        if (active) {
          setRegistration({
            eventId: id,
            accountId,
            ticket,
            error: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setRegistration({
            eventId: id,
            accountId,
            ticket: null,
            error: message(error),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [id, hasAccount, accountId, retry]);

  useEffect(() => {
    const clock = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(clock);
  }, []);

  if (!id) {
    return <div className="medium-content">Event not found.</div>;
  }

  const current =
    registration?.eventId === id &&
      registration.accountId === accountId
      ? registration
      : null;

  const ticket = current?.ticket ?? null;
  const checked = current !== null;

  const startsAt = new Date(event.datetime).getTime();
  const releasesAt = event.releaseDatetime
    ? new Date(event.releaseDatetime).getTime()
    : 0;

  const open = startsAt > now && releasesAt <= now;
  const waiting = startsAt > now && releasesAt > now;

  const canContinue =
    open && hasAccount && checked && !current?.error && !ticket;

  const submit = async () => {
    if (!canContinue || !accountId || submitting) return;

    if (!dietaryRequirements.trim()) {
      setSignupError("Enter your dietary requirements, or N/A.");
      setStep(2);
      return;
    }

    setSubmitting(true);
    setSignupError(null);

    try {
      const saved = await createTicket(
        id,
        "N/A",
        groupBuddy.trim() || "N/A",
        dietaryRequirements.trim()
      );

      setRegistration({
        eventId: id,
        accountId,
        ticket: saved,
        error: null,
      });
    } catch (error) {
      setSignupError(message(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-yellow-light mb-40">
      <div className="pt-8">
        <a
          href="/events"
          className="flex w-fit mx-8 duration-200 hover:scale-108"
        >
          <ChevronLeft className="size-8" />
          <h3 className="text-2xl mb-2">Back to Events</h3>
        </a>

        <h2 className="text-[4.2rem] font-sans font-bold uppercase mx-10">
          {event.title}
        </h2>
      </div>

      <div className="flex flex-col gap-12 justify-center mx-6 py-10 lg:flex-row lg:mx-16">
        <div className="w-full lg:max-w-96">
          <ImageBlock
            pageKey={event.imageUrl}
            alt={event.title}
            style={{
              maxWidth: "24rem",
              width: "100%",
              height: "auto",
              borderRadius: "2rem",
              boxShadow: "8px 8px #d7b51b",
            }}
            editable={true}
          />
        </div>

        <div className="w-full flex-1">
          {open && (
            <h2 className="mb-4 text-center font-monospace text-[3rem]! uppercase">
              Sign-ups Open!!
            </h2>
          )}

          <div className="rounded-4xl bg-white px-6 py-10 shadow-[8px_8px] shadow-yellow-medium sm:px-12">
            {!ticket && (
              <>
                <div className="mb-6 flex justify-center gap-8">
                  {["Event Info", "Details", "Confirmation"].map(
                    (label, index) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-2"
                      >
                        <span
                          className={
                            (step === index + 1
                              ? "bg-blue-medium"
                              : "bg-gray-400") +
                            " flex size-8 items-center justify-center rounded-full text-white"
                          }
                        >
                          {index + 1}
                        </span>
                        <span className="text-xs">{label}</span>
                      </div>
                    )
                  )}
                </div>

                {step > 1 && (
                  <button
                    type="button"
                    disabled={submitting}
                    className="mb-6 text-blue-medium hover:underline"
                    onClick={() => setStep((value) => value - 1)}
                  >
                    &lt; Back
                  </button>
                )}

                {step === 1 && (
                  <div className="space-y-6 font-alan-sans">
                    <p className="font-bold">
                      {formatDate(event.datetime)}
                    </p>

                    {event.location && <p>{event.location}</p>}

                    <p className="whitespace-pre-line text-justify">
                      {event.description}
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <form
                    className="flex flex-col gap-6 font-alan-sans"
                    onSubmit={(change) => {
                      change.preventDefault();
                      setSignupError(null);
                      setStep(3);
                    }}
                  >
                    <label className="flex flex-col gap-2 font-bold">
                      Group Buddy
                      <span className="text-xs font-normal text-gray-500">
                        Who is ONE person you would like in your team?
                      </span>
                      <input
                        type="text"
                        value={groupBuddy}
                        onChange={(change) =>
                          setGroupBuddy(change.target.value)
                        }
                        placeholder="Name Here"
                        className="border-b-2 border-yellow-dark py-2 font-normal outline-none"
                      />
                    </label>

                    <label className="flex flex-col gap-2 font-bold">
                      Dietary Requirements
                      <span className="text-xs font-normal text-gray-500">
                        Enter N/A if not applicable.
                      </span>
                      <input
                        required
                        type="text"
                        value={dietaryRequirements}
                        onChange={(change) =>
                          setDietaryRequirements(change.target.value)
                        }
                        placeholder="Enter Here"
                        className="border-b-2 border-yellow-dark py-2 font-normal outline-none"
                      />
                    </label>

                    {canContinue && (
                      <button
                        type="submit"
                        className="self-center rounded-3xl bg-yellow-dark px-12 py-2 text-blue-medium"
                      >
                        Continue &gt;
                      </button>
                    )}
                  </form>
                )}

                {step === 3 && (
                  <div className="space-y-4 font-alan-sans">
                    <h3 className="border-b-2 border-yellow-dark font-bold">
                      Confirm your details
                    </h3>

                    <p>Group Buddy: {groupBuddy.trim() || "N/A"}</p>
                    <p>Dietary Requirements: {dietaryRequirements}</p>

                    <p>
                      Your registration will be confirmed if a place is
                      available. Otherwise, you will join the waitlist.
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="mt-8 flex flex-col items-center gap-4 text-center">
              {hasAccount && !checked && (
                <p role="status">Checking your registration…</p>
              )}

              {current?.error && (
                <div role="alert" className="text-red-700">
                  <p>{current.error}</p>
                  <button
                    type="button"
                    className="underline"
                    onClick={() => setRetry((value) => value + 1)}
                  >
                    Retry
                  </button>
                </div>
              )}

              {signupError && (
                <p role="alert" className="text-red-700">
                  {signupError}
                </p>
              )}

              {ticket ? (
                <div className="flex flex-col items-center gap-3">
                  <CalendarCheck className="size-8" />
                  <p>
                    {ticket.status === "waitlisted"
                      ? "You are on the waitlist. Your place is not confirmed yet."
                      : "Your registration is confirmed. See you at the event!"}
                  </p>
                </div>
              ) : waiting ? (
                <div className="flex items-center gap-3">
                  <LockKeyhole className="size-8" />
                  <p>
                    Signups open on{" "}
                    {formatDate(event.releaseDatetime!)}
                  </p>
                </div>
              ) : !open ? (
                <p>Signups are closed.</p>
              ) : null}

              {canContinue && step === 1 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-3xl bg-yellow-dark px-12 py-2 text-blue-medium"
                >
                  Continue &gt;
                </button>
              )}

              {canContinue && step === 3 && (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => {
                    void submit();
                  }}
                  className="rounded-3xl bg-yellow-dark px-12 py-2 text-blue-medium disabled:opacity-50"
                >
                  {submitting ? "Saving…" : "Sign Up!"}
                </button>
              )}

              {!hasAccount && open && (
                <div className="flex items-center gap-3">
                  <User className="size-8" />
                  <p>
                    Log in and create your member account to sign up.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}