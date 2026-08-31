import "../style/common.css";
import "../style/image_block/ImageBlock.css";

import { Pencil, Trash2 } from "lucide-react";

import { deleteExec } from "../api/execsApi";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";

/** No access to images currently, use placeholder */
const EXEC_IMG = "src/images/exec-placeholder.png";

interface ExecProps {
  id: string;
  imageURL: string;
  displayName: string;
  execRole: string;
}

interface ExecCardProps {
  onDelete: () => void;
  onOpen: () => void;
  onEdit: () => void;
}

const ExecCard: React.FC<ExecProps & ExecCardProps> = ({
  onDelete,
  onOpen,
  onEdit,
  id,
  imageURL,
  displayName,
  execRole,
}) => {
  const { role } = useAuth();
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="executive-card">
      <div className="executive-card__top z-10">
        <div className="executive-card__media image-block">
          <img src={imageURL || EXEC_IMG} alt={displayName} onClick={onOpen} />
          {role === "admin" && (
            <button
              type="button"
              className="image-block__edit-btn"
              onClick={async () => {
                onEdit();
              }}
              title="Edit Executive"
            >
              <Pencil size={17} />
            </button>
          )}

          {role === "admin" && (
            <button
              type="button"
              className="image-block__delete-btn"
              onClick={async () => {
                setDeleting(true);
                try {
                  await deleteExec(id);
                  onDelete();
                } catch (err) {
                  console.error("Failed to delete executive:", err);
                } finally {
                  setDeleting(false);
                }
              }}
              title={deleting ? "Deleting..." : "Delete Executive"}
              disabled={deleting}
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>

        <div className="executive-card__identity" onClick={onOpen}>
          <p className="executive-card__role">{execRole}</p>
          <h2 className="executive-card__name leading-[1.1]! max-w-[80%]">
            {displayName}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ExecCard;
