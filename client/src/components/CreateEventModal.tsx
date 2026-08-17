import { useState } from "react";
import { Plus } from "lucide-react";
import { createEvent } from "../api/eventsApi";
import type { Event, CreatedEvent } from "../api/eventsApi";

import "../style/common.css";
import "../style/events.css";

const emptyForm = {
  title: "",
  description: "",
  datetime: "",
  capacity: "",
};

interface CreateEventModalProps {
  onCreated?: (event: CreatedEvent) => void;
}

export default function CreateEventModal({ onCreated }: CreateEventModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    if (submitting) return;
    setIsOpen(false);
    setError(null);
  };

  const [mouseDownOnOverlay, setMouseDownOnOverlay] = useState(false);

  const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseDownOnOverlay(e.target === e.currentTarget);
  };

  const handleOverlayMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseDownOnOverlay && e.target === e.currentTarget) {
      closeModal();
    }
    setMouseDownOnOverlay(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title || !description || !form.datetime) {
      setError("Please fill out all required fields.");
      return;
    }

    const payload: Event = {
      title,
      description,
      datetime: new Date(form.datetime).toISOString(),
    };

    if (form.capacity.trim() !== "") {
      const parsed = Number(form.capacity);
      if (!Number.isInteger(parsed) || parsed < 1) {
        setError("Capacity must be 1 or more.");
        return;
      }
      payload.capacity = parsed;
    }

    setSubmitting(true);
    try {
      const created = await createEvent(payload);
      onCreated?.(created);
      setIsOpen(false);
      setForm(emptyForm);
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to create event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="events-card flex! flex-col! items-center justify-center cursor-pointer
        transition duration-300 hover:!bg-yellow-medium hover:!border-yellow-medium hover:!text-blue-medium"
      >
        <Plus className="size-8" />
        <p>Add New Event</p>
      </button>

      {isOpen && (
        <div
          onMouseDown={handleOverlayMouseDown}
          onMouseUp={handleOverlayMouseUp}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-md rounded-4xl bg-white p-10 shadow-[10px_10px] shadow-yellow-medium">
            <h2 className="text-2xl font-bold text-blue-medium mb-6">
              New Event
            </h2>

            <form
              onSubmit={handleSubmit}
              className="font-alan-sans flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1">
                <label className="text-lg font-bold">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Sparring Night"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-bold">Description</label>
                <textarea
                  name="description"
                  rows={5}
                  placeholder="What's happening at this event?"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-bold">Date &amp; Time</label>
                <input
                  type="datetime-local"
                  name="datetime"
                  value={form.datetime}
                  onChange={handleChange}
                  className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-bold">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  min={1}
                  placeholder="Number of participants (optional)"
                  value={form.capacity}
                  onChange={handleChange}
                  className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm font-alan-sans">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="button self-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
