import "../style/common.css";
import "../style/image_block/ImageBlock.css";
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
  onOpen: () => void;
}

const ExecCard: React.FC<ExecProps & ExecCardProps> = ({
  role,
  onDelete,
  onOpen,
  id,
  imageURL,
  displayName,
  execRole,
}) => {
  return (
    <div className="executive-card">
      <button
        type="button"
        className="executive-card__click-target"
        onClick={onOpen}
        aria-label={`Open ${displayName} preview`}
      />

      <div className="executive-card__top">
        <div className="executive-card__media image-block">
          <img src={imageURL || EXEC_IMG} alt={displayName} />
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

        <div className="executive-card__identity">
          <p className="executive-card__role">{execRole}</p>
          <h2 className="executive-card__name">{displayName}</h2>
        </div>
      </div>
    </div>
  );
};

export default ExecCard;
