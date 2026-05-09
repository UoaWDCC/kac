import { Link } from "react-router-dom";
import EventCard from "../components/EventCard.tsx";
import eventsData from "../placeholders/events.json";

const PAGE_TITLE_1 = "Upcoming Events";
const PAGE_TITLE_2 = "Past Events";

const now = new Date();

const upcomingEvents = eventsData.filter(
  (event) => new Date(event.time) >= now
);
const pastEvents = eventsData.filter((event) => new Date(event.time) < now);

const Events = () => {
  const isAdmin = true; // Hardcoded for dev preview

  return (
    <div
      className="section yellow-bg"
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
            className="event-card add-event-card"
            style={{ textDecoration: "none" }}
          >
            + Add Event
          </Link>
        )}

        {upcomingEvents.map((event) => (
          <EventCard
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
          <EventCard
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
