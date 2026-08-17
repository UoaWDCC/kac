import { useEffect, useState } from "react";
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
  const showPrevious = () =>
    setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  const showNext = () =>
    setActiveIndex((prev) =>
      prev !== null && prev < visiblePhotos.length - 1 ? prev + 1 : prev
    );

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") closeViewer();
      else if (keyEvent.key === "ArrowLeft") showPrevious();
      else if (keyEvent.key === "ArrowRight") showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    globalThis.addEventListener("keydown", onKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, visiblePhotos.length]);

  const parsedDate = new Date(event.datetime);
  const formattedDate =
    !Number.isNaN(parsedDate.getTime())
      ? new Intl.DateTimeFormat("en-NZ", {
          dateStyle: "long",
        }).format(parsedDate)
      : "Date TBC";

  const activeImage = activeIndex !== null ? visiblePhotos[activeIndex] : null;
  const hasPrevious = activeIndex !== null && activeIndex > 0;
  const hasNext =
    activeIndex !== null && activeIndex < visiblePhotos.length - 1;
  const previousImage = hasPrevious ? visiblePhotos[activeIndex! - 1] : null;
  const nextImage = hasNext ? visiblePhotos[activeIndex! + 1] : null;

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

        {activeImage && (
          <div className="past-event-lightbox">
            <button
              type="button"
              className="past-event-lightbox-backdrop"
              onClick={closeViewer}
              aria-label="Close image viewer"
            />
            <div className="past-event-lightbox-stage">
              {previousImage && (
                <img
                  src={previousImage.signedUrl}
                  alt=""
                  aria-hidden="true"
                  className="past-event-lightbox-preview past-event-lightbox-preview--left"
                />
              )}

              <div className="past-event-lightbox-main-wrap">
                <img
                  src={activeImage.signedUrl}
                  alt={
                    activeImage.originalName ??
                    `${event.title} photo ${(activeIndex ?? 0) + 1}`
                  }
                  className="past-event-lightbox-image"
                />

                {hasPrevious && (
                  <button
                    type="button"
                    className="past-event-lightbox-nav past-event-lightbox-nav--left"
                    onClick={showPrevious}
                    aria-label="Previous image"
                  >
                    {"<"}
                  </button>
                )}

                {hasNext && (
                  <button
                    type="button"
                    className="past-event-lightbox-nav past-event-lightbox-nav--right"
                    onClick={showNext}
                    aria-label="Next image"
                  >
                    {">"}
                  </button>
                )}
              </div>

              {nextImage && (
                <img
                  src={nextImage.signedUrl}
                  alt=""
                  aria-hidden="true"
                  className="past-event-lightbox-preview past-event-lightbox-preview--right"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEventDetail;

