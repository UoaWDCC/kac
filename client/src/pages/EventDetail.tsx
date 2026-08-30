import { Calendar } from "lucide-react";
import { ImageBlock } from "../components/image_block/ImageBlock";
import "../style/common.css";
import "../style/event-detail.css";

type EventRecord = {
  id: string;
  title: string;
  description: string;
  location: string;
  datetime: string;
};

interface EventDetailProps {
  event: EventRecord;
}

const EventDetail = ({ event }: EventDetailProps) => {
  const parsedDate = new Date(event.datetime);
  const formattedDate = new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "long",
  }).format(parsedDate);
  const formattedTime = new Intl.DateTimeFormat("en-NZ", {
    timeStyle: "short",
  }).format(parsedDate);

  return (
    <div className="medium-content event-detail-page">
      <h1>{event.title}</h1>

      <div className="event-detail-layout">
        <div className="event-main-content">
          <div className="event-thumbnail">
            <ImageBlock
              pageKey={`event-${event.id}`}
              alt={event.title}
              editable={true}
            />
          </div>

          <div className="event-card">
            <div className="event-details-row">
              <div className="event-detail-item">
                <div className="event-icon-container">
                  <Calendar size={20} color="black" />
                </div>
                <div>
                  <div className="event-detail-label">EVENT DATE</div>
                  <div className="event-detail-value">{formattedDate}</div>
                  <div className="event-detail-subvalue">{formattedTime}</div>
                </div>
              </div>
            </div>

            <div className="event-description">{event.description}</div>
          </div>
        </div>

        <div className="event-sidebar">
          <div className="event-card">
            <button
              type="button"
              className="wide-button event-signup-button"
              onClick={() => {
                console.log("CLICK");
              }}
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
