import "../style/common.css";
import { Pencil, Trash2 } from "lucide-react";
import api from "../api";

/** No access to images currently, use placeholder */
const EXEC_IMG = "src/images/exec-placeholder.png";

interface ExecProps {
  id: string;
  imageURL: string;
  displayName: string;
  execRole: string;
  description: string;
  fullName: string;
  ethnicity: string;
  degree: string;
  mbti: string;
  fact: string;
  sponsor: string;
  greenFlag: string;
  redFlag: string;
  emojis: string;
}

interface ExecCardProps {
  role: "admin" | "user";
  onDelete: () => void;
}

const ExecCard: React.FC<ExecProps & ExecCardProps> = ({
  role,
  onDelete,
  id,
  imageURL,
  displayName,
  execRole,
  description,
  fullName,
  ethnicity,
  degree,
  mbti,
  fact,
  sponsor,
  greenFlag,
  redFlag,
  emojis,
}) => {
  return (
    <div className="executive-card">
      <div className="image-block">
        <img src={EXEC_IMG || imageURL} alt={displayName} />
        {role === "admin" && (
          <button
            className="image-block__edit-btn"
            onClick={async () => {
              // Implementation for edit functionality
            }}
            title="Edit Executive"
          >
            <Pencil size={17} />
          </button>
        )}

        {role === "admin" && (
          <button
            className="image-block__delete-btn"
            onClick={async () => {
              await api.delete(`/executives/${id}`);
              onDelete();
            }}
            title="Delete Executive"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>
      <h2>{displayName}</h2>
      <div className="card-body">
        <p>
          Meet our {execRole}, {displayName}!
        </p>
        <p className="exec-desc">{description}</p>
        <ul>
          <li>Full Name: {fullName}</li>
          {ethnicity !== "" && <li>Ethnicity: {ethnicity}</li>}
          {degree !== "" && <li>Degree: {degree}</li>}
          <li>MBTI: {mbti}</li>
          <li>Fun Fact: {fact}</li>
          <li>Favourite KAC Sponsor: {sponsor}</li>
          <li>Green Flag ✅: {greenFlag}</li>
          <li>Red Flag 🚩: {redFlag}</li>
          {emojis !== "" && <li>Fav Emojis: {emojis}</li>}
        </ul>
      </div>
    </div>
  );
};

export default ExecCard;
