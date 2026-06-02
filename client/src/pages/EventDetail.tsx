import { MapPin, Calendar } from "lucide-react";
import events from "../placeholders/events.json";
import { ImageBlock } from "../components/ImageBlock/ImageBlock";
import "../style/common.css";
import "../style/event-detail.css";

const EventDetail = () => {
  // TODO: Proper routing.
  const event = events[0];

  if (!event) {
    return <div className="medium-content">Event not found</div>;
  }

  return (
    <div className="medium-content event-detail-page">
      <h1>{event.title}</h1>

      <div className="event-detail-layout">
        <div className="event-main-content">
          <div className="event-thumbnail">
            <ImageBlock pageKey={`event-${event.id}`} alt={event.title} />
          </div>

          <div className="event-card">
            <div className="event-details-row">
              <div className="event-detail-item">
                <div className="event-icon-container">
                  <MapPin size={20} color="black" />
                </div>
                <div>
                  <div className="event-detail-label">LOCATION</div>
                  <div className="event-detail-value">{event.location}</div>
                </div>
              </div>

              <div className="event-detail-item">
                <div className="event-icon-container">
                  <Calendar size={20} color="black" />
                </div>
                <div>
                  <div className="event-detail-label">EVENT DATE</div>
                  <div className="event-detail-value">{event.date}</div>
                  <div className="event-detail-subvalue">{event.time}</div>
                </div>
              </div>
            </div>

            <div className="event-description">
              {
                event.description /* TODO: This should render RichText in the future. */
              }
            </div>
          </div>
        </div>

        <div className="event-sidebar">
          <div className="event-card">
            <button
              className="wide-button event-signup-button"
              onClick={
                () => {
                  console.log("CLICK");
                } /* TODO: Create sign up form page. */
              }
            >
              Sign Up!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
