import reactStringReplace from "react-string-replace";
import { LockKeyhole, ChevronLeft } from "lucide-react";

import events from "../placeholders/events.json";
import "../style/common.css";

const UpcomingEvent = () => {
  const event = events[2]; // later get info from id in db

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

        <h2 className="text-[4.8rem] font-sans font-bold uppercase mx-10 mb-4">
          {event.title}
        </h2>
        <div className="flex flex-row gap-8 justify-center mx-16">
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
              <h3 className="text-lg">💰 {event.price}</h3>
            </div>
          </div>
          <div className="flex flex-col w-full min-w-190 2xl:max-w-[48vw] bg-white rounded-4xl px-24 py-14 shadow-[8px_8px] shadow-yellow-medium">
            <p className="font-alan-sans text-justify text-[1rem]!">
              {reactStringReplace(event.description, "\n", (_match, i) => (
                <br key={i} />
              ))}
            </p>
            <div className="flex flex-1 items-center justify-center mt-[1.2rem]">
              <div className="flex flex-row gap-4 justify-center items-center">
                <LockKeyhole className="size-8" />
                <h2 className="uppercase text-2xl text-center">
                  Signups open on {event.dateSignOpen}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvent;
