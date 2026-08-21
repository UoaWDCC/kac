import { useState } from "react";
import { ImageBlock } from "./image_block/ImageBlock.tsx";

type Props = {
  name: string;
  description: string;
  location: string;
};

const SponsorCard = ({ name, description, location }: Props) => {
  const [hovered, setHovered] = useState(false);
  const pageKey = "sponsor-" + name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {/* THE CARD - just the image */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "15px",
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
          pageKey={pageKey}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "1rem",
          }}
          editable={true}
        />

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
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: "normal",
          marginTop: "0.75rem",
          marginBottom: "0.25rem",
          color: "var(--color-blue-medium)",
        }}
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
      >
        {location}
      </p>
    </div>
  );
};

export default SponsorCard;
