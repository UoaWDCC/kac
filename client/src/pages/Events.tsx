import "../style/common.css";
import "../style/events.css";
import EventsCard from "../components/EventsCard.tsx";
import eventsData from "../placeholders/events.json";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const getTime = (t: string) => new Date(t).getTime();
const now = Date.now();
const sortedEvents = [...eventsData].sort(
  (a, b) => getTime(b.time) - getTime(a.time)
);

const upcomingEvents = sortedEvents.filter(
  (event) => getTime(event.time) >= now
);
const pastEvents = sortedEvents.filter((event) => getTime(event.time) < now);

const { role } = useAuth();

const Events = () => {
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
      {"Upcoming Events"}
    </h1>

    <div className="event-dashboard">
      {role == "admin" && (
        <Link
          to="/Events" //add editing at some point
          className="events-card add-event-card"
          style={{ textDecoration: "none" }}
        >
          + Add Event
        </Link>
      )}

      {upcomingEvents.map((event) => (
        <EventsCard
          key={event.id}
          title={event.title}
          description={event.description}
          imageUrl={event.imageUrl}
          time={new Date(event.time)}
          status={event.status as "open" | "waitlist" | "ended"}
        />
      ))}
    </div>

    <h1
      className="title-text"
      style={{ textAlign: "center", marginBottom: "40px" }}
    >
      {"Past Events"}
    </h1>

    <div className="event-dashboard">
      {pastEvents.map((event) => (
        <EventsCard
          key={event.id}
          title={event.title}
          description={event.description}
          imageUrl={event.imageUrl}
          time={new Date(event.time)}
          status={event.status as "open" | "waitlist" | "ended"}
        />
      ))}
    </div>
  </div>;
};

export default Events;
