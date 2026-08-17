import { useEffect, useState } from "react";
import "../style/common.css";
import "../style/events.css";
import EventsCard from "../components/EventsCard.tsx";
import CreateEventModal from "../components/CreateEventModal.tsx";
import { getAllEvents } from "../api/eventsApi";
import type { EventsByTime } from "../api/eventsApi";
import { useAuth } from "../auth/useAuth";

// TODO: Unreleased events are only visible to admins.
// Currently, on an admin POV, there is no visual differnce between released and unreleased events.

const Events = () => {
  const { role } = useAuth();
  const [events, setEvents] = useState<EventsByTime>({
    upcoming: [],
    past: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = () => {
    setLoading(true);
    setError(null);

    return getAllEvents()
      .then((data) => setEvents(data))
      .catch((err) => {
        setError(typeof err === "string" ? err : "Failed to load events.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;

    getAllEvents()
      .then((data) => {
        if (!cancelled) setEvents(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(typeof err === "string" ? err : "Failed to load events.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreated = () => {
    loadEvents();
  };

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

      {error && <p className="text-red-600">{error}</p>}

      <div className="event-dashboard">
        {role === "admin" && <CreateEventModal onCreated={handleCreated} />}

        {!loading &&
          events.upcoming.map((event) => (
            <EventsCard
              key={event._id}
              title={event.title}
              description={event.description}
              imageUrl={event.imageUrl}
              datetime={new Date(event.datetime)}
            />
          ))}
      </div>

      <h1 className="title-text">{"Past Events:"}</h1>

      <div className="event-dashboard">
        {!loading &&
          events.past.map((event) => (
            <EventsCard
              key={event._id}
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
