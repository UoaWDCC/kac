import "../style/common.css";
import "../style/events.css";
import EventsCard from "../components/EventsCard.tsx";
import CreateEventModal from "../components/CreateEventModal.tsx";
import eventsData from "../placeholders/events.json";
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
        {role === "admin" && <CreateEventModal />}

        {upcomingEvents.map((event) => (
          <EventsCard
            key={event.id}
            title={event.title}
            description={event.description}
            imageUrl={event.imageUrl}
            datetime={new Date(event.datetime)}
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
            datetime={new Date(event.datetime)}
          />
        ))}
      </div>
    </div>
  );
};

export default Events;
