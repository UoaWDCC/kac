import "../style/common.css";
import "../style/events.css";
import EventsCard from "../components/EventsCard.tsx";
import eventsData from "../placeholders/events.json";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const getTime = (t: string) => new Date(t).getTime();
const now = Date.now();
const sortedEvents = [...eventsData].sort(
  (a, b) => getTime(b.datetime) - getTime(a.datetime)
);

const upcomingEvents = sortedEvents.filter(
  (event) => getTime(event.datetime) >= now
);
const pastEvents = sortedEvents.filter(
  (event) => getTime(event.datetime) < now
);

const Events = () => {
  const { role } = useAuth();

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
      <h1 className="title-text">{"Upcoming Events:"}</h1>

      <div className="event-dashboard">
        {role === "admin" && (
          <Link
            to="/Events"
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
            location={event.location}
            datetime={new Date(event.datetime)}
            status={event.status as "open" | "waitlist" | "ended"}
          />
        ))}
      </div>

      <h1 className="title-text">{"Past Events:"}</h1>

      <div className="event-dashboard">
        {pastEvents.map((event) => (
          <EventsCard
            key={event.id}
            title={event.title}
            description={event.description}
            imageUrl={event.imageUrl}
            location={event.location}
            datetime={new Date(event.datetime)}
            status={event.status as "open" | "waitlist" | "ended"}
          />
        ))}
      </div>
    </div>
  );
};

export default Events;
