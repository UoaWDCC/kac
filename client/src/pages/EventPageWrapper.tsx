import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getEventById } from "../api/eventApi";
import { deleteEvent } from "../api/eventsApi";
import type { EventQuestion } from "../api/eventsApi";
import { getGalleryImages } from "../api/imageApi";
import { useAuth } from "../auth/useAuth";
import EventFormModal from "../components/EventFormModal";
import PastEventDetail from "./PastEventDetail";
import UpcomingEvent from "./UpcomingEvent";

import "../style/events.css";

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
  registrationRequired?: boolean;
  groupBuddyEnabled?: boolean;
  dietaryRequirementsEnabled?: boolean;
  customQuestions?: EventQuestion[];
};

type GalleryImage = {
  id: string;
  originalName?: string;
  signedUrl: string;
  uploadedAt?: string;
};

const EventPageWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteEvent(event._id);
      toast.success("Event deleted.");
      navigate("/events");
    } catch (err) {
      setDeleteError(
        typeof err === "string"
          ? err
          : "Failed to delete event. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const adminActions =
    role === "admin" ? (
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="events-pill-button events-pill-button--outline"
        >
          <Pencil size={16} aria-hidden="true" />
          <span>Edit Event</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setDeleteError(null);
            setDeleteOpen(true);
          }}
          className="events-pill-button events-pill-button--danger"
        >
          <Trash2 size={16} aria-hidden="true" />
          <span>Delete Event</span>
        </button>
      </div>
    ) : null;

  return (
    <>
      {eventDateTime > now ? (
        <UpcomingEvent key={id} event={event} adminActions={adminActions} />
      ) : (
        <PastEventDetail
          event={event}
          gallery={galleryImages}
          adminActions={adminActions}
        />
      )}

      {editOpen && (
        <EventFormModal
          event={event}
          onClose={() => setEditOpen(false)}
          onSaved={(saved) =>
            setEvent((previous) =>
              previous ? { ...previous, ...saved } : previous
            )
          }
        />
      )}

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-event-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[6px_6px] shadow-yellow-medium sm:p-8"
          >
            <h2
              id="delete-event-title"
              className="text-2xl font-bold text-blue-medium"
            >
              Delete event?
            </h2>
            <p className="font-alan-sans mt-3 text-gray-600">
              This will permanently delete{" "}
              <strong className="text-blue-medium">{event.title}</strong>. This
              cannot be undone.
            </p>

            {deleteError && (
              <p
                role="alert"
                className="font-alan-sans mt-4 text-sm font-semibold text-red-600"
              >
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
                className="w-auto! cursor-pointer rounded-full px-5 py-2 font-bold text-blue-medium underline-offset-4 hover:underline disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="events-pill-button events-pill-button--danger w-auto! disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventPageWrapper;
