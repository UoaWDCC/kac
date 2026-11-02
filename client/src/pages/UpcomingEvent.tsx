import { useEffect, useState, useRef } from "react";
import type { MouseEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import reactStringReplace from "react-string-replace";

import {
  LockKeyhole,
  CalendarCheck,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  User,
} from "lucide-react";

import createTicket, { getMyTicket } from "../api/ticketsApi";
import type { TicketRecord } from "../api/ticketsApi";
import type { EventRecord } from "./EventPageWrapper";
import { useAuth } from "../auth/useAuth.ts";
import api from "../api";

import "../style/common.css";

import { ImageBlock } from "../components/image_block/ImageBlock";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? ""
);

const stripeElementOptions = {
  style: {
    base: {
      fontSize: "15px",
      fontFamily: "'Alan Sans', sans-serif",
      color: "#2d3748",
      "::placeholder": { color: "#a0aec0" },
    },
    invalid: { color: "#e53e3e" },
  },
};

const EventSignupForm = ({ event: sourceEvent }: { event: EventRecord }) => {
  const { id } = useParams<{ id: string }>();
  const stripe = useStripe();
  const elements = useElements();
  const [currentStep, setCurrentStep] = useState(1);
  const [cardIsOpen, setCardIsOpen] = useState(true);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [cardComplete, setCardComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });
  const completedPaymentId = useRef<string | null>(null);
  const [groupBuddy, setGroupBuddy] = useState("");
  const [dietaryRequirements, setDietaryRequirements] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { hasAccount, user } = useAuth();
  const accountId = user?.id;

  const [registration, setRegistration] = useState<{
    eventId: string;
    accountId: string;
    attempt: number;
    ticket: TicketRecord | null;
    error: string | null;
  } | null>(null);
  const [lookupRetry, setLookupRetry] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionInFlight = useRef(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!id || !hasAccount || !accountId) return;
    let active = true;

    getMyTicket(id)
      .then((ticket) => {
        if (active) {
          setRegistration({
            eventId: id,
            accountId,
            attempt: lookupRetry,
            ticket,
            error: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message =
          typeof error === "string" ? error : "Could not check registration.";
        setRegistration({
          eventId: id,
          accountId,
          attempt: lookupRetry,
          ticket: null,
          error: message,
        });
        toast.error(message);
      });

    return () => {
      active = false;
    };
  }, [id, hasAccount, accountId, lookupRetry]);

  useEffect(() => {
    const clock = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(clock);
  }, []);

  if (!id || !sourceEvent)
    return <div className="medium-content">Event not found!</div>;

  const currentRegistration =
    registration?.eventId === id &&
    registration.accountId === accountId &&
    registration.attempt === lookupRetry
      ? registration
      : null;
  const ticket = currentRegistration?.ticket ?? null;
  const ticketLoaded = currentRegistration !== null;
  const ticketLoadError = currentRegistration?.error ?? null;
  const userSignedUp = ticket !== null;
  const requiresPayment = (sourceEvent.price ?? 0) > 0;

  const validateDetails = () => {
    if (!dietaryRequirements.trim()) {
      setSubmitError("Please enter your dietary requirements, or N/A.");
      return false;
    }
    if (requiresPayment && !completedPaymentId.current) {
      if (!stripe || !elements) {
        setSubmitError("Payment processor is not ready yet. Please try again.");
        return false;
      }
      if (!cardComplete.number || !cardComplete.expiry || !cardComplete.cvc) {
        setCardIsOpen(true);
        setSubmitError(
          "Please complete your card number, expiry date and CVC."
        );
        return false;
      }
    }
    setSubmitError(null);
    return true;
  };

  const startsAt = new Date(sourceEvent.datetime).getTime();
  const releasesAt = sourceEvent.releaseDatetime
    ? new Date(sourceEvent.releaseDatetime).getTime()
    : 0;

  const formatEventDate = (value: string, includeTime = false) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-NZ", {
      dateStyle: "long",
      ...(includeTime ? { timeStyle: "short" as const } : {}),
      timeZone: "Pacific/Auckland",
    }).format(date);
  };

  const event = {
    ...sourceEvent,
    location: sourceEvent.location || "N/A",
    date: formatEventDate(sourceEvent.datetime),
    time: Number.isFinite(startsAt)
      ? new Intl.DateTimeFormat("en-NZ", {
          timeStyle: "short",
          timeZone: "Pacific/Auckland",
        }).format(new Date(sourceEvent.datetime))
      : "",
    dateSignOpen: sourceEvent.releaseDatetime
      ? formatEventDate(sourceEvent.releaseDatetime, true)
      : "",
    signUpStatus:
      startsAt > now && releasesAt <= now
        ? "Open"
        : startsAt > now && releasesAt > now
          ? "Waiting"
          : "Closed",
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      !accountId ||
      currentStep !== 3 ||
      !ticketLoaded ||
      ticketLoadError ||
      userSignedUp ||
      event.signUpStatus !== "Open" ||
      submissionInFlight.current
    ) {
      return;
    }

    if (!validateDetails()) {
      setCurrentStep(2);
      return;
    }

    submissionInFlight.current = true;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (requiresPayment && !completedPaymentId.current) {
        const { data } = await api.post<{
          clientSecret: string;
          paymentIntentId: string;
          status: string;
        }>("/payments/create-payment-intent", {
          type: "event_ticket",
          eventId: id,
        });

        if (data.status === "succeeded") {
          completedPaymentId.current = data.paymentIntentId;
        } else {
          const cardNumberElement = elements?.getElement(CardNumberElement);
          if (!stripe || !cardNumberElement) {
            throw new Error(
              "Card details are not ready. Please return to Details."
            );
          }
          const { error, paymentIntent } = await stripe.confirmCardPayment(
            data.clientSecret,
            { payment_method: { card: cardNumberElement } }
          );
          if (error)
            throw new Error(
              error.message ?? "Payment failed. Please try again."
            );
          if (!paymentIntent || paymentIntent.status !== "succeeded") {
            throw new Error("Payment has not been completed yet.");
          }
          completedPaymentId.current = paymentIntent.id;
        }
      }

      const saved = await createTicket(
        id,
        completedPaymentId.current ?? "N/A",
        groupBuddy.trim() || "N/A",
        dietaryRequirements.trim()
      );

      setRegistration({
        eventId: id,
        accountId,
        attempt: lookupRetry,
        ticket: saved,
        error: null,
      });
      setCurrentStep(4);
    } catch (error) {
      const reason =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Could not save registration.";
      const message = completedPaymentId.current
        ? `Your payment was completed. ${reason} Retry to save your registration without paying again.`
        : reason;
      setSubmitError(message);
      toast.error(message);
    } finally {
      submissionInFlight.current = false;
      setIsSubmitting(false);
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

      <div className="flex flex-row gap-22 justify-center mx-16 -my-24 py-10">
        {/* Left - Image and Details */}
        <div className="pt-10 mt-24">
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
        {/* Right - Description & Form */}
        <div className="flex flex-col w-full min-w-190 2xl:max-w-[48vw]">
          {event.signUpStatus == "Open" && (
            <h2 className="uppercase text-[3rem] text-center font-monospace font-medium mb-4">
              Sign-ups Open!!
            </h2>
          )}
          <div className="bg-white rounded-4xl px-18 pb-10 pt-10 shadow-[8px_8px] shadow-yellow-medium">
            <div>
              {/* Top-left Back Button for Form Steps */}
              {event.signUpStatus == "Open" &&
                !userSignedUp &&
                currentStep > 1 &&
                currentStep < 4 && (
                  <div className="w-fit mb-6">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() =>
                        setCurrentStep(Math.max(1, currentStep - 1))
                      }
                      className="text-blue-medium hover:underline hover:cursor-pointer underline-offset-6"
                    >
                      {"< "} Back
                    </button>
                  </div>
                )}
              {/* Stepper Progress */}
              {currentStep != 4 &&
                event.signUpStatus == "Open" &&
                !userSignedUp && (
                  <div className="flex flex-row gap-16 justify-center mb-4">
                    <div className="flex flex-col gap-2 items-center">
                      <div
                        className={`${
                          currentStep == 1 ? "bg-blue-medium" : "bg-gray-400"
                        } text-white rounded-full size-8 text-center`}
                      >
                        <p className="pt-0.5">1</p>
                      </div>
                      <p
                        className={`${
                          currentStep == 1
                            ? "text-blue-medium"
                            : "text-gray-400"
                        } font-alan-sans text-[0.8rem]!`}
                      >
                        Event Info
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <div
                        className={`${
                          currentStep == 2 ? "bg-blue-medium" : "bg-gray-400"
                        } text-white rounded-full size-8 text-center`}
                      >
                        <p className="pt-0.5">2</p>
                      </div>
                      <p
                        className={`${
                          currentStep == 2
                            ? "text-blue-medium"
                            : "text-gray-400"
                        } font-alan-sans text-[0.8rem]!`}
                      >
                        Details
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <div
                        className={`${
                          currentStep == 3 ? "bg-blue-medium" : "bg-gray-400"
                        } text-white rounded-full size-8 text-center`}
                      >
                        <p className="pt-0.5">3</p>
                      </div>
                      <p
                        className={`${
                          currentStep == 3
                            ? "text-blue-medium"
                            : "text-gray-400"
                        } font-alan-sans text-[0.8rem]!`}
                      >
                        Confirmation
                      </p>
                    </div>
                  </div>
                )}

              {/* Step 1: Event Info */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-8 font-alan-sans">
                  <div className="flex flex-row mt-6 font-bold justify-between">
                    <p className="text-[1rem]!">📆 {event.date}</p>
                    {event.time != "" && (
                      <p className="text-[1rem]!">🕑 {event.time}</p>
                    )}
                    <p className="text-[1rem]!">📍 {event.location}</p>
                    <p className="text-[1rem]!">
                      💰 {requiresPayment ? "$" + event.price : "Free"}
                    </p>
                  </div>
                  <p className="text-[1rem]! text-justify">
                    {reactStringReplace(
                      event.description,
                      "\n",
                      (_match, i) => (
                        <br key={i} />
                      )
                    )}
                  </p>
                </div>
              )}

              {/* Step 2: Details */}
              {/* Keep Stripe Elements mounted while reviewing confirmation. */}
              {currentStep < 4 && !userSignedUp && (
                <form
                  ref={formRef}
                  onSubmit={(e) => e.preventDefault()}
                  className="font-alan-sans flex flex-col gap-10"
                  style={{ display: currentStep === 2 ? undefined : "none" }}
                >
                  <div className="flex flex-row gap-8 justify-between">
                    <div className="flex flex-col gap-1 w-[50%]">
                      <div>
                        <h2 className="text-lg font-bold">Group Buddy</h2>
                        <p className="text-xs! text-gray-400">
                          Who is ONE person you would like in your team?
                        </p>
                      </div>
                      <input
                        id="groupBuddy"
                        type="text"
                        value={groupBuddy}
                        onChange={(e) => setGroupBuddy(e.target.value)}
                        placeholder="Name Here"
                        className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-[50%]">
                      <div>
                        <div className="flex flex-row justify-between">
                          <h2 className="text-lg font-bold">
                            Dietary Requirements
                          </h2>
                          <div className="bg-yellow-light rounded-full justify-center">
                            <p className="text-xs! font-bold px-2 pt-1.5">
                              Required
                            </p>
                          </div>
                        </div>
                        <p className="text-xs! text-gray-400">
                          Please put N/A if not applicable.
                        </p>
                      </div>
                      <input
                        required
                        id="dietaryRequirements"
                        type="text"
                        value={dietaryRequirements}
                        onChange={(e) => setDietaryRequirements(e.target.value)}
                        placeholder="Enter Here"
                        className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                      />
                    </div>
                  </div>
                  {requiresPayment && (
                    <div className="flex flex-col">
                      <div className="flex flex-row justify-between w-[80%] py-2">
                        <h2 className="text-lg font-bold">
                          Payment Information
                        </h2>
                        <div className="bg-yellow-light rounded-full justify-center">
                          <p className="text-xs! font-bold px-2 pt-1.5">
                            Required
                          </p>
                        </div>
                      </div>
                      <div className="w-[80%]">
                        {/* Almost but not quite same as Collapsible component, diff style */}
                        <button
                          onClick={() => setCardIsOpen(!cardIsOpen)}
                          type="button"
                        >
                          <div className="flex flex-row justify-between pb-2 border-l-0 border-r-0 border-t-0 border-b-yellow-dark border-2">
                            <h2 className="w-full text-left">
                              Please enter your card details
                            </h2>
                            <span>
                              {cardIsOpen ? <ChevronUp /> : <ChevronDown />}
                            </span>
                          </div>
                        </button>
                        <div
                          className="border-yellow-dark border-2 rounded-xl px-8 py-8 mt-4"
                          style={{ display: cardIsOpen ? "block" : "none" }}
                        >
                          <div className="flex flex-col gap-8">
                            <div>
                              <h2 className="text-lg font-bold">Card Number</h2>
                              <div className="w-full py-1 border-b-yellow-dark border-b-2">
                                <CardNumberElement
                                  options={stripeElementOptions}
                                  onChange={(event) => {
                                    setCardComplete((value) => ({
                                      ...value,
                                      number: event.complete,
                                    }));
                                    setSubmitError(
                                      event.error?.message ?? null
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex flex-row gap-12 pb-4">
                              <div className="flex flex-col w-[50%]">
                                <h2 className="text-lg font-bold">
                                  Expiry Date
                                </h2>
                                <div className="w-full py-1 border-b-yellow-dark border-b-2">
                                  <CardExpiryElement
                                    options={stripeElementOptions}
                                    onChange={(event) => {
                                      setCardComplete((value) => ({
                                        ...value,
                                        expiry: event.complete,
                                      }));
                                      setSubmitError(
                                        event.error?.message ?? null
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col w-[50%]">
                                <div>
                                  <div className="flex flex-row justify-between">
                                    <h2 className="text-lg font-bold">
                                      CVC / CVV
                                    </h2>
                                  </div>
                                </div>
                                <div className="w-full py-1 border-b-yellow-dark border-b-2">
                                  <CardCvcElement
                                    options={stripeElementOptions}
                                    onChange={(event) => {
                                      setCardComplete((value) => ({
                                        ...value,
                                        cvc: event.complete,
                                      }));
                                      setSubmitError(
                                        event.error?.message ?? null
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-md! text-right py-4">
                          Total:{" "}
                          {event.price != null
                            ? new Intl.NumberFormat("en-NZ", {
                                style: "currency",
                                currency: "NZD",
                              }).format(event.price)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                  {submitError && (
                    <p
                      role="alert"
                      className="text-red-500 text-sm font-semibold"
                    >
                      {submitError}
                    </p>
                  )}
                </form>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="font-alan-sans">
                  <h3 className="text-lg font-bold my-6 border-b-2 border-b-yellow-dark">
                    Please Read Before Confirming:
                  </h3>
                  We will not be giving out refunds for cancellations made
                  within 24 hours prior to the event. Any refund requests must
                  be made with at least one day's notice.
                </div>
              )}

              {/* Step 4: Completion Message */}
              {currentStep === 4 && userSignedUp && (
                <div className="flex flex-col align-middle pt-6 pb-2 gap-4 items-center">
                  <ImageBlock
                    pageKey="mascot-small"
                    alt="Small Mascot"
                    style={{
                      maxWidth: "20%",
                      height: "auto",
                      rotate: "-10deg",
                    }}
                    editable={true}
                  />
                  <p className="mt-2 font-alan-sans text-[1rem]! text-center w-[70%]">
                    {ticket?.status === "waitlisted"
                      ? "Thank you for joining the waitlist. Your place is not confirmed yet."
                      : "Thank you for signing up for this event, we look forward to seeing you there!"}
                  </p>
                  <p className="font-alan-sans text-[1rem]! text-center w-[80%]">
                    Your registration is saved. Return to this page to check
                    your status.
                  </p>
                </div>
              )}

              <div className="flex flex-1 items-center justify-center">
                {/* Opening Later - No form if sign-ups not open yet */}
                {event.signUpStatus == "Waiting" && (
                  <div className="flex flex-row gap-4 justify-center items-center mt-10">
                    <LockKeyhole className="size-8" />
                    <h2 className="uppercase text-2xl text-center">
                      Sign-ups open on {event.dateSignOpen}
                    </h2>
                  </div>
                )}
                {/* Can Sign Up - Show form with continue button */}
                {hasAccount &&
                  ((currentStep === 4 && userSignedUp) ||
                    (event.signUpStatus === "Open" &&
                      !userSignedUp &&
                      currentStep < 3)) && (
                    <div className="w-full flex justify-center">
                      <button
                        type="button"
                        disabled={
                          currentStep !== 4 && (!ticketLoaded || isSubmitting)
                        }
                        onClick={() => {
                          if (currentStep === 4) return;
                          if (ticketLoadError) {
                            setLookupRetry((value) => value + 1);
                            return;
                          }
                          if (!ticketLoaded || isSubmitting || userSignedUp)
                            return;
                          if (currentStep === 2) {
                            if (
                              !formRef.current?.reportValidity() ||
                              !validateDetails()
                            ) {
                              return;
                            }
                          }
                          setCurrentStep(Math.min(3, currentStep + 1));
                        }}
                        className="cursor-pointer w-fit! h-10 mt-8! rounded-3xl text-blue-medium hover:text-yellow-light bg-yellow-dark! hover:bg-blue-medium! duration-200 shadow-[2px_4px] shadow-yellow-medium hover:shadow-gray-400"
                      >
                        {currentStep == 4 && (
                          <a href="/" className="text-lg px-10">
                            Back Home {">"}
                          </a>
                        )}
                        {currentStep < 3 && (
                          <p className="py-2 px-12">
                            {ticketLoadError
                              ? "Retry"
                              : !ticketLoaded
                                ? "Checking…"
                                : "Continue >"}
                          </p>
                        )}
                      </button>
                    </div>
                  )}
                {/* Handle form submission separately */}
                {currentStep === 3 &&
                  event.signUpStatus === "Open" &&
                  hasAccount &&
                  !userSignedUp &&
                  ticketLoaded &&
                  !ticketLoadError && (
                    <div className="w-full flex flex-col items-center justify-center">
                      {submitError && (
                        <p
                          role="alert"
                          className="text-red-500 text-sm font-semibold mb-2 text-center"
                        >
                          {submitError}
                        </p>
                      )}
                      <button
                        type="button"
                        disabled={isSubmitting || (requiresPayment && !stripe)}
                        onClick={handleSubmit}
                        className="cursor-pointer w-fit! h-10 mt-8! rounded-3xl text-blue-medium hover:text-yellow-light bg-yellow-dark! hover:bg-blue-medium! duration-200 shadow-[2px_4px] shadow-yellow-medium hover:shadow-gray-400"
                      >
                        <p className="py-2 px-12">
                          {isSubmitting ? "Processing…" : "Sign Up!"}
                        </p>
                      </button>
                    </div>
                  )}

                {/* Already Signed Up */}
                {userSignedUp && currentStep !== 4 && (
                  <div className="flex flex-row gap-4 justify-center items-center mt-10">
                    <CalendarCheck className="size-8" />
                    <h2 className="uppercase text-2xl text-center">
                      {ticket?.status === "waitlisted"
                        ? `You are on the waitlist for ${event.title}!`
                        : `You have signed up for ${event.title}!`}
                    </h2>
                  </div>
                )}
                {/* Not Signed In */}
                {!hasAccount && event.signUpStatus == "Open" && (
                  <div className="flex flex-row gap-4 justify-center items-center mt-10">
                    <User className="size-8" />
                    <h2 className="uppercase text-2xl text-center">
                      Log in to sign up for {event.title}!
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpcomingEvent = ({ event }: { event: EventRecord }) => (
  <Elements stripe={stripePromise}>
    <EventSignupForm event={event} />
  </Elements>
);

export default UpcomingEvent;
