import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPastEventBySlug } from "../api/eventApi";
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

const PastEventDetail = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<PastEventRecord | null>(null);
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
        const data = await getPastEventBySlug(slug);
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Event not found");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [slug]);

  const photos = Array.from({ length: 24 }, (_, index) => ({
    id: `photo-${index + 1}`,
  }));
  const visiblePhotos = photos.slice(0, MAX_VISIBLE_IMAGES);
  const showMorePhotosButton = photos.length > MAX_VISIBLE_IMAGES;

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

        <div className="past-event-grid">
          {visiblePhotos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              className="past-event-tile"
              aria-label={`Open photo ${index + 1}`}
            />
          ))}
        </div>

        {showMorePhotosButton && (
          <button type="button" className="button past-event-more-button">
            More Photos
          </button>
        )}
      </div>
    </div>
  );
};

export default PastEventDetail;