import "../style/common.css";
import "../style/events.css";
import { ImageBlock } from "./ImageBlock/ImageBlock";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DEFAULT_IMAGE = "src/images/event-image.png";
export const DEFAULT_USER_ACTION = "SIGN UP";
export const DEFAULT_ADMIN_ACTION = "EDIT EVENT";

interface EventProps {
  id: string;
  imageUrl: string;
  title: string;
  time: Date;
  location: string;
  description: string;
  memberPrice?: string;
  nonMemberPrice?: string;
  role?: "admin" | "user";
  status: "open" | "waitlist" | "ended";
}

const EventsCard: React.FC<EventProps> = ({
  id,
  imageUrl,
  title,
  time,
  location,
  memberPrice,
  nonMemberPrice,
  role = "user",
}) => {
  const navigate = useNavigate();

  // Format date: e.g. "2nd April - 6PM"
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

  const handleActionClick = () => {
    // Eventually navigate to the extended page
    // For now, we'll just log the intent
    console.log(`Navigating to extended page for event: ${id} as ${role}`);
    navigate(`/Events/${id}`);
  };

  return (
    <div className="event-card">
      <h2 className="event-title">{title}</h2>
      <div className="event-image-container">
        <ImageBlock
          pageKey={imageUrl || DEFAULT_IMAGE}
          role="user"
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        />
      </div>
      <div className="event-content">
        <div className="event-info">
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

          <button className="rsvp-button" onClick={handleActionClick}>
            {role === "admin" ? DEFAULT_ADMIN_ACTION : DEFAULT_USER_ACTION}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsCard;
