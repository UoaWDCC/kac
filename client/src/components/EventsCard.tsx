import "../style/common.css";
import "../style/events.css";
import { ImageBlock } from "./ImageBlock/ImageBlock";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export const DEFAULT_IMAGE = "src/images/event-image.png";

const SEM1_START = new Date("2026-03-02");
const SEM2_START = new Date("2026-07-20");

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

    const sem = datetime >= SEM2_START ? 2 : 1;

    // rough calculation of week, maybe input instead
    const diff =
      Math.floor(
        (datetime.getTime() - (sem === 1 ? SEM1_START : SEM2_START).getTime()) /
          86400000 /
          7
      ) + 1;
    const week = diff > 6 ? diff - 2 : diff;

    return `Sem ${sem} Week ${week}: ${month} ${day}`;
  };

  const handleActionClick = () => {
    // Eventually navigate to the extended page
    // For now, we'll just log the intent
    console.log(`Navigating to extended page for event as ${role}`);
    navigate(`/Events/`);
  };

  return (
    <div className="events-card">
      <div className="event-image-container">
        <ImageBlock
          pageKey={imageUrl || DEFAULT_IMAGE}
          alt={title}
          style={{ height: "100%" }}
        />
      </div>
      <div className="event-content">
        <div className="event-date">
          <span>{formatDate(datetime)}</span>
        </div>
        <h2 className="event-title">{title}</h2>
      </div>
      <button className="redirect-button" onClick={handleActionClick}>
        {"SIGN UP"}
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default EventsCard;
