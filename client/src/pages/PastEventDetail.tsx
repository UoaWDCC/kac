import { useEffect, useState } from "react";
import { PastEventLightbox } from "../components/PastEventLightbox";
import "../style/common.css";
import "../style/past-event-detail.css";

const MAX_IMAGES_PER_ROW = 7;
const MAX_ROWS = 5;
const MAX_VISIBLE_IMAGES = MAX_IMAGES_PER_ROW * MAX_ROWS;

type EventRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  datetime: string;
  status?: string | null;
};

type GalleryImage = {
  id: string;
  originalName?: string;
  signedUrl: string;
  uploadedAt?: string;
};

interface PastEventDetailProps {
  event: EventRecord;
  gallery: GalleryImage[];
}

const PastEventDetail = ({ event, gallery }: PastEventDetailProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visiblePhotos = gallery.slice(0, MAX_VISIBLE_IMAGES);
  const showMorePhotosButton = gallery.length > MAX_VISIBLE_IMAGES;

  const closeViewer = () => setActiveIndex(null);

  const parsedDate = new Date(event.datetime);
  const formattedDate =
    !Number.isNaN(parsedDate.getTime())
      ? new Intl.DateTimeFormat("en-NZ", {
          dateStyle: "long",
        }).format(parsedDate)
      : "Date TBC";

  return (
    <div className="past-event-page">
      <div className="past-event-content">
        <p className="past-event-back-link">{"<"} Back to all events</p>
        <p className="past-event-subtitle">{formattedDate}</p>
        <h1 className="past-event-title">{event.title}</h1>

        {visiblePhotos.length > 0 ? (
          <div className="past-event-grid">
            {visiblePhotos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                className="past-event-tile"
                onClick={() => setActiveIndex(index)}
                aria-label={`Open photo ${index + 1}`}
              >
                <img
                  src={photo.signedUrl}
                  alt={
                    photo.originalName ?? `${event.title} photo ${index + 1}`
                  }
                  className="past-event-image"
                  loading={index < 14 ? "eager" : "lazy"}
                  decoding="async"
                />
              </button>
            ))}
          </div>
        ) : (
          <p className="past-event-empty">No photos uploaded yet.</p>
        )}

        {showMorePhotosButton && (
          <button type="button" className="button past-event-more-button">
            More Photos
          </button>
        )}
      </div>

      {activeIndex !== null && (
        <PastEventLightbox
          images={visiblePhotos}
          activeIndex={activeIndex}
          onClose={closeViewer}
          onSelectIndex={setActiveIndex}
        />
      )}
    </div>
  );
};

export default PastEventDetail;

