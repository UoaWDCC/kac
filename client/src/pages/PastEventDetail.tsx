import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PastEventLightbox } from "../components/PastEventLightbox";
import { getPastEventBySlug } from "../api/eventApi";
import { getImagesByGalleryKey } from "../api/imageApi";
import "../style/common.css";
import "../style/past-event-detail.css";

const MAX_IMAGES_PER_ROW = 7;
const MAX_ROWS = 5;
const MAX_VISIBLE_IMAGES = MAX_IMAGES_PER_ROW * MAX_ROWS;

type PastEventRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  datetime?: string;
  date?: string;
  status?: string | null;
};

type GalleryImage = {
  id: string;
  originalName?: string;
  signedUrl: string;
  uploadedAt?: string;
};

const PastEventDetail = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<PastEventRecord | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!slug) {
        setError("Event not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [eventData, imageData] = await Promise.all([
          getPastEventBySlug(slug),
          getImagesByGalleryKey(slug),
        ]);
        setEvent(eventData);
        setGalleryImages(Array.isArray(imageData) ? imageData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Event not found");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [slug]);

  const visiblePhotos = galleryImages.slice(0, MAX_VISIBLE_IMAGES);
  const showMorePhotosButton = galleryImages.length > MAX_VISIBLE_IMAGES;

  const closeViewer = () => setActiveIndex(null);

  if (loading) {
    return <div className="past-event-page">Loading...</div>;
  }

  if (error || !event) {
    return <div className="past-event-page">{error ?? "Event not found"}</div>;
  }

  const rawDate = event.datetime ?? event.date ?? "";
  const parsedDate = rawDate ? new Date(rawDate) : null;
  const formattedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? new Intl.DateTimeFormat("en-NZ", {
          dateStyle: "long",
        }).format(parsedDate)
      : rawDate || "Date TBC";

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