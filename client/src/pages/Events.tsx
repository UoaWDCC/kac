import "../style/common.css";
import "../style/events.css";
import EventsCard from "../components/EventsCard.tsx";
import eventsData from "../placeholders/events.json";
import { Link } from "react-router-dom";

const PAGE_TITLE_1 = "Upcoming Events";
const PAGE_TITLE_2 = "Past Events";

const getTime = (t: string) => new Date(t).getTime();
const now = Date.now();
const sortedEvents = [...eventsData].sort(
  (a, b) => getTime(b.time) - getTime(a.time)
);

const upcomingEvents = sortedEvents.filter(
  (event) => getTime(event.time) >= now
);
const pastEvents = sortedEvents.filter((event) => getTime(event.time) < now);

const Events = () => {
  const isAdmin = true; // Hardcoded admin for now

  return (
    <div
      className="event-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        className="title-text"
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        {PAGE_TITLE_1}
      </h1>

      <div className="event-dashboard">
        {isAdmin && (
          <Link
            to="/Events/new"
            className="events-card add-event-card"
            style={{ textDecoration: "none" }}
          >
            + Add Event
          </Link>
        )}

        {upcomingEvents.map((event) => (
          <EventsCard
            key={event.id}
            id={event.id}
            imageUrl={event.imageUrl}
            title={event.title}
            time={new Date(event.time)}
            location={event.location}
            description={event.description}
            memberPrice={event.memberPrice}
            nonMemberPrice={event.nonMemberPrice}
            role={isAdmin ? "admin" : "user"}
            status={event.status as "open" | "waitlist" | "ended"}
          />
        ))}
      </div>

      <h1
        className="title-text"
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        {PAGE_TITLE_2}
      </h1>

      <div className="event-dashboard">
        {pastEvents.map((event) => (
          <EventsCard
            key={event.id}
            id={event.id}
            imageUrl={event.imageUrl}
            title={event.title}
            time={new Date(event.time)}
            location={event.location}
            description={event.description}
            memberPrice={event.memberPrice}
            nonMemberPrice={event.nonMemberPrice}
            role={isAdmin ? "admin" : "user"}
            status={event.status as "open" | "waitlist" | "ended"}
          />
        ))}
      </div>
    </div>
  );
};

export default Events;
