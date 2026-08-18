import { useEffect, useMemo, useState } from "react";
import "../style/common.css";
import "../style/events.css";
import EventsCard from "../components/EventsCard.tsx";
import CreateEventModal from "../components/CreateEventModal.tsx";
import { getAllEvents } from "../api/eventsApi";
import type { CreatedEvent, EventsByTime } from "../api/eventsApi";
import { useAuth } from "../auth/useAuth";

import { Link } from "react-router-dom";

import { ImageBlock } from "../components/image_block/ImageBlock";
import kacoTitle from "../images/kaco-title.png";

// TODO: Unreleased events are only visible to admins.
// Currently, on an admin POV, there is no visual differnce between released and unreleased events.

interface EventsByYear {
  year: number;
  events: CreatedEvent[];
}

function groupPastEventsByYear(events: CreatedEvent[]): EventsByYear[] {
  const grouped = new Map<number, CreatedEvent[]>();

  for (const event of events) {
    const year = new Date(event.datetime).getFullYear();
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year)!.push(event);
  }

  return Array.from(grouped.entries())
    .map(([year, events]) => ({ year, events }))
    .sort((a, b) => b.year - a.year);
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
    // <CreateEventModal onCreated={handleCreated} />

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

      <section className="events-content events-section">
        <h2 className="events-section-title">Upcoming Events:</h2>

        <div className="events-featured-grid">
          {events.upcoming.map((event) => (
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
                  <p className="events-card-eyebrow">{event.datetime}</p>
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

      {pastByYear.map((section) => (
        <section className="events-content events-section" key={section.year}>
          <h2 className="events-section-title">{section.year} Past Events:</h2>
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
                  <p className="events-card-eyebrow">{event.datetime}</p>
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
