import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { ImageBlock } from "./image_block/ImageBlock.tsx";
import { sponsorPageKey } from "../util/sponsors";
import { useAuth } from "../auth/useAuth";
import { deleteSponsor } from "../api/sponsorsApi";

type SponsorProps = {
  name: string;
  description: string;
  location: string;
  /** Logo tile only - drops the name and address beneath the card. */
  compact?: boolean;
  sponsorId?: string;
  imageVersion?: number;
  onEdit?: () => void;
  onDelete?: () => void;
};

const SponsorCard = ({
  name,
  description,
  location,
  compact,
  sponsorId,
  imageVersion,
  onEdit,
  onDelete,
}: SponsorProps) => {
  const { role } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pageKey = sponsorPageKey(name);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {/* THE CARD - just the image */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          width: "100%",
          boxShadow: "5px 5px 0px var(--color-yellow-medium)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          aspectRatio: "1",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageBlock
          key={imageVersion}
          pageKey={pageKey}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "0.5rem",
          }}
          editable={false}
        />
        {role === "admin" && onEdit && (
          <button
            type="button"
            className="image-block__edit-btn"
            onClick={onEdit}
            title="Edit Sponsor"
            aria-label={`Edit ${name}`}
          >
            <Pencil size={17} />
          </button>
        )}

        {role === "admin" && sponsorId && onDelete && (
          <button
            type="button"
            className="image-block__delete-btn"
            onClick={async () => {
              if (deleting) return;
              setDeleting(true);
              try {
                await deleteSponsor(sponsorId);
                onDelete?.();
              } catch (err) {
                console.error("Failed to delete sponsor:", err);
              } finally {
                setDeleting(false);
              }
            }}
            title={deleting ? "Deleting..." : "Delete Sponsor"}
            disabled={deleting}
          >
            <Trash2 size={17} />
          </button>
        )}

        {/* DARK
         BLUE OVERLAY ON HOVER */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            backgroundColor: hovered ? "rgba(11, 45, 74, 0.85)" : "transparent",
            transition: "background-color 0.3s, opacity 0.3s",
            opacity: hovered ? 1 : 0,
          }}
        >
          <p
            style={{
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "Alan Sans, sans-serif",
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* NAME + LOCATION - outside the card */}
      {compact ? null : (
        <>
          <h3
            style={{
              fontWeight: "normal",
              marginTop: "0.75rem",
              marginBottom: "0.25rem",
              color: "var(--color-blue-medium)",
            }}
            className="text-[0.8rem] sm:text-[1rem]"
          >
            {name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--color-grey-medium)",
              margin: 0,
              fontFamily: "Alan Sans, sans-serif",
            }}
            className="hidden sm:display-block"
          >
            {location}
          </p>
        </>
      )}
    </div>
  );
};

export default SponsorCard;
