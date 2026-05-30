import "../style/common.css";
import "../style/events.css";
import { ImageBlock } from "./ImageBlock/ImageBlock";
import { Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export const DEFAULT_IMAGE = "src/images/event-image.png";

interface EventProps {
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  datetime: Date;
  status: "open" | "waitlist" | "ended";
}

const EventsCard: React.FC<EventProps> = ({ title, imageUrl, datetime }) => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const formatDate = (datetime: Date) => {
    const day = datetime.getDate();
    const month = datetime.toLocaleString("default", { month: "long" });

    return `${month} ${day}`;
  };

  const handleActionClick = () => {
    // Eventually navigate to the extended page
    // For now, we'll just log the intent
    console.log(`Navigating to extended page for event as ${role}`);
    navigate(`/Events/`);
  };

  return (
    <div className="events-card">
      <h2 className="event-title">{title}</h2>
      <div className="event-image-container">
        <ImageBlock
          pageKey={imageUrl || DEFAULT_IMAGE}
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
        <div className="event-meta">
          <div className="meta-item">
            <Clock size={16} className="meta-icon" />
            <span>{formatDate(datetime)}</span>
          </div>
        </div>

        <hr className="event-divider" />

        <button className="redirect-button" onClick={handleActionClick}>
          {"SIGN UP"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default EventsCard;
