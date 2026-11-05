import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../api/eventApi";
import { getGalleryImages } from "../api/imageApi";
import PastEventDetail from "./PastEventDetail";
import UpcomingEvent from "./UpcomingEvent";

export type EventRecord = {
  _id: string;
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  datetime: string;
  capacity?: number;
  releaseDatetime?: string;
  price?: number;
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
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      setEvent(null);
      setGalleryImages([]);

      if (!id) {
        setError("Event not found");
        setLoading(false);
        return;
      }

      try {
        const eventData: EventRecord = await getEventById(id);
        if (!active) return;
        setEvent(eventData);

        const eventDateTime = new Date(eventData.datetime);

        if (eventDateTime <= new Date()) {
          const year = eventDateTime.getFullYear();
          const images = await getGalleryImages(eventData.title, year);
          if (!active) return;
          setGalleryImages(Array.isArray(images) ? images : []);
        }
      } catch (err) {
        if (active) {
          setError(
            typeof err === "string"
              ? err
              : err instanceof Error
                ? err.message
                : "Event not found"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <div className="medium-content">Loading...</div>;
  if (error || !event) {
    return <div className="medium-content">{error ?? "Event not found"}</div>;
  }

  if (event._id.toLowerCase() !== id?.toLowerCase()) {
    return <div className="medium-content">Loading...</div>;
  }

  const now = new Date();
  const eventDateTime = new Date(event.datetime);

  if (eventDateTime > now) {
    return <UpcomingEvent key={id} event={event} />;
  }

  return <PastEventDetail event={event} gallery={galleryImages} />;
};

export default EventPageWrapper;
