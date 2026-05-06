import "../style/common.css";
import "../style/event.css";
import { ImageBlock } from "./ImageBlock/ImageBlock";
import { Clock, MapPin, ArrowRight, Pencil } from "lucide-react";

// Placeholders
export const DEFAULT_EVENT_IMAGE = "src/images/event-image.png";
export const DEFAULT_EVENT_LABEL = "UPCOMING EVENT";
export const DEFAULT_RSVP_TEXT = "RSVP";

interface EventProps {
  imageUrl: string;
  title: string;
  time: Date;
  location: string;
  description: string;
  memberPrice?: string;
  nonMemberPrice?: string;
  rsvpUrl?: string;
  role?: "admin" | "user";
  onEdit?: () => void;
}

const EventCard: React.FC<EventProps> = ({
  imageUrl,
  title,
  time,
  location,
  description,
  memberPrice,
  nonMemberPrice,
  rsvpUrl,
  role = "user",
  onEdit,
}) => {
  // Format date: "2nd April - 6PM"
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    const getOrdinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `${getOrdinal(day)} ${month} - ${hour12}${ampm}`;
  };

  return (
    <div className="event-card">
      {role === "admin" && (
        <button
          className="event-card__edit-btn"
          onClick={onEdit}
          title="Edit event details"
        >
          <Pencil size={17} />
        </button>
      )}

      <div className="event-content">
        <div className="event-info">
          <span className="event-label">{DEFAULT_EVENT_LABEL}</span>
          <h2 className="event-title">{title}</h2>

          <div className="event-meta">
            <div className="meta-item">
              <Clock size={16} className="meta-icon" />
              <span>{formatDate(time)}</span>
            </div>
            <div className="meta-item">
              <MapPin size={16} className="meta-icon" />
              <span>{location}</span>
            </div>
          </div>

          <div className="event-tags">
            {memberPrice && (
              <span className="event-tag">{memberPrice} Members</span>
            )}
            {nonMemberPrice && (
              <span className="event-tag">{nonMemberPrice} Non-Members</span>
            )}
          </div>

          <hr className="event-divider" />

          <p className="event-description">{description}</p>

          {rsvpUrl && (
            <a href={rsvpUrl} className="rsvp-button">
              {DEFAULT_RSVP_TEXT} <ArrowRight size={18} />
            </a>
          )}
        </div>
      </div>
      <div className="event-image-container">
        <ImageBlock
          pageKey={imageUrl || DEFAULT_EVENT_IMAGE}
          role={"user"}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        />
      </div>
    </div>
  );
};

export default EventCard;
