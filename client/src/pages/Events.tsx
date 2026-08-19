import { useEffect, useMemo, useState } from "react";

import { formatEventDateTime } from "../util/formatDate";

import "../style/common.css";
import "../style/events.css";

import CreateEventModal from "../components/CreateEventModal.tsx";
import { ImageBlock } from "../components/image_block/ImageBlock";

import { getAllEvents } from "../api/eventsApi";
import type { CreatedEvent, EventsByTime } from "../api/eventsApi";

import { useAuth } from "../auth/useAuth";
import { Link } from "react-router-dom";

import kacoTitle from "../images/kaco-title.png";

// TODO: Unreleased events are only visible to admins.
// Currently, on an admin POV, there is no visual differnce between released and unreleased events.

interface EventsByYear {
  year: number | null;
  events: CreatedEvent[];
}

function groupPastEventsByYear(events: CreatedEvent[]): EventsByYear[] {
  const grouped = new Map<number | null, CreatedEvent[]>();

  for (const event of events) {
    const parsedYear = new Date(event.datetime).getFullYear();
    const year = Number.isNaN(parsedYear) ? null : parsedYear;

    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year)!.push(event);
  }

  // Sort events within each year by datetime, descending; null/invalid years are sorted last
  return Array.from(grouped.entries())
    .map(([year, events]) => ({ year, events }))
    .sort((a, b) => {
      if (a.year === null && b.year === null) return 0;
      if (a.year === null) return 1;
      if (b.year === null) return -1;
      return b.year - a.year;
    });
}

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

  const pastByYear = useMemo(
    () => groupPastEventsByYear(events.past),
    [events.past]
  );

  return (
    <div className="events-page">
      <title>Kiwi Asian Club - Events</title>

      {/** Title **/}
      <section
        className="section h1 events-title-section"
        aria-labelledby="events-title"
      >
        <div className="events-title-group">
          <img
            className="events-title-kaco"
            src={kacoTitle}
            alt="Kaco mascot"
          />
          <h1 className="title-text font-sans">OUR EVENTS</h1>
        </div>
      </section>

      {error && <p className="text-red-600">{error}</p>}

      {/** Upcoming Concerts **/}
      {!loading && (
        <section className="events-content events-section">
          <div className="flex flex-row justify-between items-center">
            {events.upcoming.length > 0 && (
              <h2 className="events-section-title">Upcoming Events:</h2>
            )}
            {role === "admin" && <CreateEventModal onCreated={handleCreated} />}
          </div>

          <div className="events-featured-grid">
            {!loading &&
              events.upcoming.map((event) => (
                <article className="events-feature-card" key={event._id}>
                  <div className="events-feature-image">
                    <ImageBlock
                      pageKey={event.imageUrl}
                      alt={event.title}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div className="events-feature-details">
                    <div>
                      <p className="events-card-eyebrow">
                        {formatEventDateTime(event.datetime)}
                      </p>
                      <h3 className="events-feature-title">{event.title}</h3>
                    </div>
                    <Link
                      className="events-pill-button"
                      to={`/events/${event._id}`}
                    >
                      See Details
                      <span aria-hidden="true">&gt;</span>
                    </Link>
                  </div>
                </article>
              ))}
          </div>
        </section>
      )}

      {/** Past Concerts by Year**/}
      {!loading &&
        pastByYear.map((section) => (
          <section
            className="events-content events-section"
            key={section.year ?? "unknown"}
          >
            <h2 className="events-section-title">
              {section.year !== null
                ? `${section.year} Past Events:`
                : "Past Events (Date Unknown):"}
            </h2>
            <div className="events-past-grid">
              {section.events.map((event) => (
                <article className="events-past-card" key={event._id}>
                  <div className="events-past-image">
                    <ImageBlock
                      pageKey={event.imageUrl}
                      alt={event.title}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div className="events-past-copy">
                    <p className="events-card-eyebrow">
                      {formatEventDateTime(event.datetime)}
                    </p>
                    <h3 className="events-past-title">{event.title}</h3>
                  </div>
                </article>
              ))}
            </div>
            <button className="events-more-button" type="button">
              More Photos
            </button>
          </section>
        ))}
    </div>
  );
};

export default Events;
