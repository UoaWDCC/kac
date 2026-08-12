import { Link } from "react-router-dom";

import kacoTitle from "../images/kaco-title.png";
import placeholder from "../images/placeholder.png";
import "../style/common.css";
import "../style/events.css";

interface FeaturedEvent {
  id: string;
  eyebrow: string;
  title: string;
}

interface PastEvent {
  id: string;
  eyebrow: string;
  title: string;
}

const featuredEvents: FeaturedEvent[] = [
  {
    id: "kac-kbbq",
    eyebrow: "Sem 1 Week 11: May 29",
    title: "KAC KBBQ",
  },
  {
    id: "ski-trip",
    eyebrow: "Inter-semester Break 2026",
    title: "SKI TRIP",
  },
];

const eventPattern: Omit<PastEvent, "id">[] = [
  {
    eyebrow: "Sem 1 Week 9: May 15",
    title: "KAC x TANSA: World Tour",
  },
  {
    eyebrow: "Sem 1 Week 8: May 8",
    title: "Ice Skating",
  },
  {
    eyebrow: "Sem 1 Week 7: May 1",
    title: "A Night Out in Hongdae",
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

const footerColumns = [
  {
    heading: "About",
    links: ["Our History", "Our Execs"],
  },
  {
    heading: "Events",
    links: ["Upcoming Events", "Past Events"],
  },
  {
    heading: "Sponsors",
    links: ["CBD Sponsors", "New Market Sponsors", "Other Sponsors"],
  },
  {
    heading: "Contact Us",
    links: ["Contact", "FAQ's"],
  },
  {
    heading: "Connect With Us!",
    links: ["Social Media Logos here"],
  },
];

const Events = () => {
  return (
    <div className="events-page">
      <section className="events-title-section" aria-labelledby="events-title">
        <div className="events-title-group">
          <img
            className="events-title-kaco"
            src={kacoTitle}
            alt="Kaco mascot"
          />
          <h1 id="events-title" className="events-title-text font-sans">
            OUR EVENTS
          </h1>
        </div>
      </section>

      <section className="events-content events-section">
        <h2 className="events-section-title">Upcoming Events:</h2>
        <div className="events-featured-grid">
          {featuredEvents.map((event) => (
            <article className="events-feature-card" key={event.id}>
              <div className="events-feature-image">
                <img src={placeholder} alt="" />
              </div>
              <div className="events-feature-details">
                <div>
                  <p className="events-card-eyebrow">{event.eyebrow}</p>
                  <h3 className="events-feature-title">{event.title}</h3>
                </div>
                <Link className="events-pill-button" to={`/events/${event.id}`}>
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
                  <img src={placeholder} alt="" />
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

      <footer className="events-footer">
        <img
          className="events-footer-mascot"
          src={kacoTitle}
          alt=""
          aria-hidden="true"
        />
        <div className="events-footer-content">
          <nav className="events-footer-links" aria-label="Events footer">
            {footerColumns.map((column) => (
              <div className="events-footer-column" key={column.heading}>
                <h2>{column.heading}</h2>
                {column.links.map((link) => (
                  <a href="/" key={link}>
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </nav>
          <div className="events-footer-bottom">
            <span className="events-footer-brand">
              <img src={kacoTitle} alt="" aria-hidden="true" />
              KAC
            </span>
            <span>&copy; 2026 Kiwi Asian Club</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Events;
