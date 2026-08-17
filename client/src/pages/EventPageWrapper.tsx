import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../api/eventApi";
import { getGalleryImages } from "../api/imageApi";
import EventDetail from "./EventDetail";
import PastEventDetail from "./PastEventDetail";

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

const EventPageWrapper = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Event not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const eventData: EventRecord = await getEventById(id);
        setEvent(eventData);

        const now = new Date();
        const eventDateTime = new Date(eventData.datetime);

        if (eventDateTime <= now) {
          const year = eventDateTime.getFullYear();
          const images = await getGalleryImages(eventData.title, year);
          setGalleryImages(Array.isArray(images) ? images : []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Event not found");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="medium-content">Loading...</div>;
  if (error || !event) {
    return <div className="medium-content">{error ?? "Event not found"}</div>;
  }

  const now = new Date();
  const eventDateTime = new Date(event.datetime);

  if (eventDateTime > now) {
    return <EventDetail event={event} />;
  }

  return <PastEventDetail event={event} gallery={galleryImages} />;
};

export default EventPageWrapper;
