import { useState } from "react";
import reactStringReplace from "react-string-replace";

import {
  LockKeyhole,
  CalendarCheck,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import events from "../placeholders/events.json";
import "../style/common.css";

import { ImageBlock } from "../components/image_block/ImageBlock";

const UpcomingEvent = () => {
  const event = events[2]; // later get info from id in db
  let userSignedUp = false; // in future, check db for this
  const [currentStep, setCurrentStep] = useState(1);
  const [cardIsOpen, setCardIsOpen] = useState(false);

  if (!event) {
    return <div className="medium-content">Event not found</div>;
  }

  return (
    <div className="bg-yellow-light py-10">
      <div className="mx-14">
        <a href="/events" className="flex w-fit duration-200 hover:scale-108">
          <ChevronLeft className="size-8" />
          <h3 className="text-2xl mb-2">Back to Events</h3>
        </a>

        <h2 className="text-[4.8rem] font-sans font-bold uppercase mx-10 mb-10">
          {event.title}
        </h2>

        <div className="flex flex-row gap-16 justify-center mx-16">
          {/* Left - Image and Details */}
          <div className="p-6 pl-2 flex flex-col gap-8 self-center">
            <img
              src={event.coverImgUrl}
              className="max-w-56 2xl:max-w-84 rounded-4xl shadow-[8px_8px] shadow-yellow-medium"
              alt={event.title}
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-lg">📆 {event.date}</h3>
              {event.time != "" && (
                <div className="mb-1">
                  <h3 className="text-lg">🕑 {event.time}</h3>
                </div>
              )}
              <h3 className="text-lg pl-1">📍 {event.location}</h3>
              <h3 className="text-lg">💰 ${event.price}</h3>
            </div>
          </div>
          {/* Right - Description & Form */}
          <div className="flex flex-col w-full min-w-190 2xl:max-w-[48vw]">
            {event.signUpStatus == "Open" && (
              <h2 className="uppercase text-[3rem] text-center font-monospace font-medium mb-2">
                Sign-ups Open!!
              </h2>
            )}
            <div className="bg-white rounded-4xl px-24 pb-14 pt-10 shadow-[8px_8px] shadow-yellow-medium">
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
                    <div className="flex flex-row gap-16 justify-center mb-8">
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
                  <div>
                    <p className="font-alan-sans text-justify text-[1rem]!">
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
                  <div className="font-alan-sans flex flex-col gap-10">
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
                          type="text"
                          placeholder="Enter Here"
                          className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                        />
                      </div>
                    </div>
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
                        <button onClick={() => setCardIsOpen(!cardIsOpen)}>
                          <div className="flex flex-row justify-between pb-2 border-l-0 border-r-0 border-t-0 border-b-yellow-dark border-2">
                            <h2 className="w-full text-left">
                              Please enter your card details
                            </h2>
                            <span>
                              {cardIsOpen ? <ChevronUp /> : <ChevronDown />}
                            </span>
                          </div>
                        </button>
                        {cardIsOpen && (
                          <div className="border-yellow-dark border-2 rounded-xl px-8 py-8 mt-4">
                            <div className="flex flex-col gap-8">
                              <div>
                                <h2 className="text-lg font-bold">
                                  Card Number
                                </h2>
                                <input
                                  type="string"
                                  placeholder="0000 0000 0000 0000"
                                  className="w-full py-1 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                                />
                              </div>
                              <div className="flex flex-row gap-12 pb-4">
                                <div className="flex flex-col w-[50%]">
                                  <h2 className="text-lg font-bold">
                                    Expiry Date
                                  </h2>
                                  <input
                                    type="date"
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
                                    type="text"
                                    placeholder="000"
                                    className="w-full py-1 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <p className="text-md! text-right py-4">
                          Total: ${event.price}
                        </p>
                      </div>
                    </div>
                  </div>
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
                      Thank you for signing up for this event, we look forward
                      to seeing you there!
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
                  {event.signUpStatus == "Open" && !userSignedUp && (
                    <div className="w-full flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentStep(Math.min(4, currentStep + 1))
                        }
                        className="cursor-pointer w-fit! h-10 mt-8! rounded-3xl text-blue-medium hover:text-yellow-light bg-yellow-dark! hover:bg-blue-medium! duration-200 shadow-[2px_4px] shadow-yellow-medium hover:shadow-gray-400"
                      >
                        {currentStep == 3 && (
                          <p className="py-2 px-12">Sign Up!</p>
                        )}
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
    </div>
  );
};

export default UpcomingEvent;
