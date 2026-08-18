import { Link } from "react-router-dom";

import { ImageBlock } from "../components/image_block/ImageBlock";
import kacoTitle from "../images/kaco-title.png";
import "../style/common.css";
import "../style/events.css";

interface FeaturedEvent {
  id: string;
  link: string;
  eyebrow: string;
  title: string;
  imageTag: string;
}

interface PastEvent {
  id: string;
  eyebrow: string;
  title: string;
  imageTag: string;
}

const featuredEvents: FeaturedEvent[] = [
  {
    id: "kac-kbbq",
    link: "6a6ee549b6759256e88091db",
    eyebrow: "Sem 1 Week 11: May 29",
    title: "KAC KBBQ",
    imageTag: "KAC KBBQ",
  },
  {
    id: "ski-trip",
    link: "6a6ef457c7a83d02200a7865",
    eyebrow: "Inter-semester Break 2026",
    title: "SKI TRIP",
    imageTag: "SKI TRIP",
  },
];

const eventPattern: Omit<PastEvent, "id">[] = [
  {
    eyebrow: "Sem 1 Week 9: May 15",
    title: "KAC x TANSA: World Tour",
    imageTag: "KAC x TANSA: World Tour",
  },
  {
    eyebrow: "Sem 1 Week 8: May 8",
    title: "Ice Skating",
    imageTag: "Ice Skating",
  },
  {
    eyebrow: "Sem 1 Week 7: May 1",
    title: "A Night Out in Hongdae",
    imageTag: "A Night Out in Hongdae",
  },
];

const makePastEvents = (year: string, rows: number) =>
  Array.from({ length: rows }).flatMap((_, rowIndex) =>
    eventPattern.map((event, eventIndex) => ({
      ...event,
      id: `${year}-${rowIndex}-${eventIndex}`,
      eyebrow:
        rowIndex > 0 && eventIndex === 0
          ? "Sem 1 Mid Sem Break"
          : event.eyebrow,
    }))
  );

const pastEventSections = [
  {
    year: "2026",
    events: makePastEvents("2026", 3),
  },
  {
    year: "2025",
    events: makePastEvents("2025", 2),
  },
];

const Events = () => {
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

      <section className="events-content events-section">
        <h2 className="events-section-title">Upcoming Events:</h2>
        <div className="events-featured-grid">
          {featuredEvents.map((event) => (
            <article className="events-feature-card" key={event.id}>
              <div className="events-feature-image">
                <ImageBlock
                  pageKey={event.imageTag}
                  alt={event.title}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="events-feature-details">
                <div>
                  <p className="events-card-eyebrow">{event.eyebrow}</p>
                  <h3 className="events-feature-title">{event.title}</h3>
                </div>
                <Link
                  className="events-pill-button"
                  to={`/events/${event.link}`}
                >
                  See Details
                  <span aria-hidden="true">&gt;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {pastEventSections.map((section) => (
        <section className="events-content events-section" key={section.year}>
          <h2 className="events-section-title">{section.year} Past Events:</h2>
          <div className="events-past-grid">
            {section.events.map((event) => (
              <article className="events-past-card" key={event.id}>
                <div className="events-past-image">
                  <ImageBlock
                    pageKey={event.imageTag}
                    alt={event.title}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className="events-past-copy">
                  <p className="events-card-eyebrow">{event.eyebrow}</p>
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
