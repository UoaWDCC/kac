import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import reactStringReplace from "react-string-replace";

import {
  LockKeyhole,
  CalendarCheck,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { getEventById } from "../api/eventsApi";
import type { Event } from "../api/eventsApi";
import "../style/common.css";

import { ImageBlock } from "../components/image_block/ImageBlock";

const UpcomingEvent = () => {
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [cardIsOpen, setCardIsOpen] = useState(false);
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const formRef = useRef<HTMLFormElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const expiryRef = useRef<HTMLInputElement | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardVerification, setCardVerification] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");

  const handleCardNumberChange = (e: any) => {
    // Keep only digits, max 16, and insert spaces every 4 digits for readability
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    const parts = digits.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(" ") : "");
  };

  const handleCardVerificationChange = (e: any) => {
    // Also only digits, max 3 for CVC/CVV
    const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCardVerification(digits);
  };

  const handleCardExpiryChange = (e: any) => {
    setCardExpiry(e.target.value);
    if (expiryRef.current) expiryRef.current.setCustomValidity("");
  };

  const validateExpiry = () => {
    if (!expiryRef.current) return true;
    const val = expiryRef.current.value;
    if (!val) {
      expiryRef.current.setCustomValidity("");
      return true;
    }

    const exp = new Date(val);
    const today = new Date();

    // Consider expired if same date, disregard time of day
    today.setHours(0, 0, 0, 0);
    exp.setHours(0, 0, 0, 0);

    if (exp <= today) {
      expiryRef.current.setCustomValidity(
        "Card has expired. Enter a valid expiry date."
      );
      return false;
    }
    expiryRef.current.setCustomValidity("");
    return true;
  };

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      const eventData = await getEventById(id);
      setEvent(eventData);
    };
    fetchEvent();
  }, [id]);

  if (!id || !event)
    return <div className="medium-content">Event not found!</div>;

  let userSignedUp = false; // in future, check user's account for this

  return (
    <div className="bg-yellow-light">
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
          <img
            src={event.coverImgUrl}
            className="max-w-72 2xl:max-w-md h-fit rounded-4xl shadow-[8px_8px] shadow-yellow-medium"
            alt={event.title}
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
                    <p className="text-[1rem]!">💰 ${event.price}</p>
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
              {currentStep === 2 && (
                <form
                  ref={formRef}
                  onSubmit={(e) => e.preventDefault()}
                  className="font-alan-sans flex flex-col gap-10"
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
                        type="text"
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
                        type="text"
                        placeholder="Enter Here"
                        className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-between w-[80%] py-2">
                      <h2 className="text-lg font-bold">Payment Information</h2>
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
                        ref={cardContainerRef}
                        className="border-yellow-dark border-2 rounded-xl px-8 py-8 mt-4"
                        style={{ display: cardIsOpen ? "block" : "none" }}
                      >
                        <div className="flex flex-col gap-8">
                          <div>
                            <h2 className="text-lg font-bold">Card Number</h2>
                            <input
                              required
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-number"
                              placeholder="0000 0000 0000 0000"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              pattern="[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}"
                              className="w-full py-1 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                            />
                          </div>
                          <div className="flex flex-row gap-12 pb-4">
                            <div className="flex flex-col w-[50%]">
                              <h2 className="text-lg font-bold">Expiry Date</h2>
                              <input
                                required
                                ref={expiryRef}
                                type="date"
                                value={cardExpiry}
                                onChange={handleCardExpiryChange}
                                placeholder="dd/mm/yy"
                                className="w-full py-1 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                              />
                            </div>
                            <div className="flex flex-col w-[50%]">
                              <div>
                                <div className="flex flex-row justify-between">
                                  <h2 className="text-lg font-bold">
                                    CVC / CVV
                                  </h2>
                                </div>
                              </div>
                              <input
                                required
                                type="text"
                                placeholder="000"
                                pattern="[0-9]{3}"
                                value={cardVerification}
                                onChange={handleCardVerificationChange}
                                className="w-full py-1 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                              />
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
                          : ""}
                      </p>
                    </div>
                  </div>
                </form>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="font-alan-sans">
                  <h3 className="text-lg font-bold mb-6 border-b-2 border-b-yellow-dark">
                    Please Read Before Confirming:
                  </h3>
                  We will not be giving out refunds for cancellations made
                  within 24 hours prior to the event. Any refund requests must
                  be made with at least one day's notice.
                </div>
              )}

              {/* Step 4: Completion Message */}
              {currentStep === 4 && (
                <div className="flex flex-col align-middle pt-6 pb-2 gap-4 items-center">
                  <ImageBlock
                    pageKey="mascot-small"
                    alt="Small Mascot"
                    style={{
                      maxWidth: "20%",
                      height: "auto",
                      rotate: "-10deg",
                    }}
                  />
                  <p className="mt-2 font-alan-sans text-[1rem]! text-center w-[70%]">
                    Thank you for signing up for this event, we look forward to
                    seeing you there!
                  </p>
                  <p className="font-alan-sans text-[1rem]! text-center w-[80%]">
                    You will receive a confirmation email once your spot has
                    been confirmed, so make sure to check your email {":)"}
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
                {event.signUpStatus == "Open" &&
                  !userSignedUp &&
                  currentStep != 3 && (
                    <div className="w-full flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          validateExpiry();
                          if (currentStep === 2) {
                            if (
                              formRef.current &&
                              !formRef.current.checkValidity()
                            ) {
                              const firstInvalid =
                                formRef.current.querySelector(
                                  ":invalid"
                                ) as HTMLElement | null;
                              if (
                                firstInvalid &&
                                cardContainerRef.current &&
                                cardContainerRef.current.contains(
                                  firstInvalid
                                ) &&
                                !cardIsOpen
                              ) {
                                // Open the card so the invalid field becomes visible, then focus & show validation
                                setCardIsOpen(true);
                                setTimeout(() => {
                                  try {
                                    firstInvalid.focus();
                                    (firstInvalid as any).reportValidity
                                      ? (firstInvalid as any).reportValidity()
                                      : formRef.current?.reportValidity();
                                  } catch (e) {
                                    formRef.current?.reportValidity();
                                    console.error(e);
                                  }
                                }, 10);
                                return;
                              }
                              formRef.current.reportValidity();
                              return;
                            }
                          }
                          setCurrentStep(Math.min(4, currentStep + 1));
                        }}
                        className="cursor-pointer w-fit! h-10 mt-8! rounded-3xl text-blue-medium hover:text-yellow-light bg-yellow-dark! hover:bg-blue-medium! duration-200 shadow-[2px_4px] shadow-yellow-medium hover:shadow-gray-400"
                      >
                        {currentStep == 4 && (
                          <a href="/Home" className="text-lg px-10">
                            Back Home {">"}
                          </a>
                        )}
                        {currentStep < 3 && (
                          <p className="py-2 px-12">Continue {">"}</p>
                        )}
                      </button>
                    </div>
                  )}
                {/* Handle form submission separately */}
                {currentStep == 3 && (
                  <div className="w-full flex justify-center">
                    <button
                      type="submit"
                      onClick={() => {
                        validateExpiry();
                        if (
                          formRef.current &&
                          !formRef.current.checkValidity()
                        ) {
                          const firstInvalid = formRef.current.querySelector(
                            ":invalid"
                          ) as HTMLElement | null;
                          if (
                            firstInvalid &&
                            cardContainerRef.current &&
                            cardContainerRef.current.contains(firstInvalid) &&
                            !cardIsOpen
                          ) {
                            setCardIsOpen(true);
                            setTimeout(() => {
                              try {
                                firstInvalid.focus();
                                (firstInvalid as any).reportValidity
                                  ? (firstInvalid as any).reportValidity()
                                  : formRef.current?.reportValidity();
                              } catch (e) {
                                formRef.current?.reportValidity();
                                console.error(e);
                              }
                            }, 10);
                            return;
                          }
                          formRef.current.reportValidity();
                          return;
                        }
                        setCurrentStep(Math.min(4, currentStep + 1));
                      }}
                      className="cursor-pointer w-fit! h-10 mt-8! rounded-3xl text-blue-medium hover:text-yellow-light bg-yellow-dark! hover:bg-blue-medium! duration-200 shadow-[2px_4px] shadow-yellow-medium hover:shadow-gray-400"
                    >
                      <p className="py-2 px-12">Sign Up!</p>
                    </button>
                  </div>
                )}

                {/* Already Signed Up */}
                {userSignedUp && (
                  <div className="flex flex-row gap-4 justify-center items-center mt-10">
                    <CalendarCheck className="size-8" />
                    <h2 className="uppercase text-2xl text-center">
                      You have signed up for {event.title}!
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

export default UpcomingEvent;
