import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createEvent } from "../api/eventsApi";
import type { Event, CreatedEvent } from "../api/eventsApi";
import RichTextEditor from "./RichTextEditor";

import "../style/common.css";
import "../style/events.css";

const emptyForm = {
  title: "",
  description: "",
  datetime: "",
  capacity: "",
  price: "0",
  releaseDatetime: "",
  registrationRequired: true,
};

const inputClass =
  "w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none";

const RequiredChip = () => (
  <span className="shrink-0 rounded-full bg-yellow-light px-2.5 py-0.5 text-[0.7rem] font-bold">
    Required
  </span>
);

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

  const handleDescriptionChange = (value: string) => {
    setForm((prev) => ({ ...prev, description: value }));
  };

  const handleRegistrationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setForm((prev) => ({ ...prev, registrationRequired: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const title = form.title.trim();
    const description = form.description.trim();
    const descriptionText = description
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!title || !descriptionText || !form.datetime) {
      setError("Please fill out all required fields.");
      return;
    }

    const payload: Event = {
      title,
      description,
      datetime: new Date(form.datetime).toISOString(),
      price: Number(form.price),
      registrationRequired: form.registrationRequired,
    };

    if (form.releaseDatetime.trim() !== "") {
      const release = new Date(form.releaseDatetime);
      const eventDate = new Date(form.datetime);
      if (release.getTime() > eventDate.getTime()) {
        setError("Release date can't be after the event itself.");
        return;
      }
      payload.releaseDatetime = release.toISOString();
    }

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
        className="events-pill-button !mb-6.5"
      >
        <Plus size={16} aria-hidden="true" />
        <p>Add Event</p>
      </button>

      {isOpen && (
        <div
          onMouseDown={handleOverlayMouseDown}
          onMouseUp={handleOverlayMouseUp}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-event-title"
            className="flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-4xl bg-white shadow-[10px_10px] shadow-yellow-medium"
          >
            <div className="shrink-0 border-b-2 border-yellow-light">
              <div className="flex w-full items-center justify-between gap-4 px-6 py-5 sm:px-10 sm:py-6">
                <h2
                  id="create-event-title"
                  className="min-w-0 flex-1 whitespace-nowrap text-2xl font-bold text-blue-medium"
                >
                  New Event
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  className="w-auto! shrink-0 cursor-pointer rounded-full p-1 text-blue-medium transition-colors hover:bg-yellow-light!"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="font-alan-sans flex flex-col gap-5 overflow-y-auto px-6 py-6 [scrollbar-gutter:stable] sm:px-10">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="eventTitle" className="text-lg font-bold">
                      Title
                    </label>
                    <RequiredChip />
                  </div>
                  <input
                    id="eventTitle"
                    required
                    type="text"
                    name="title"
                    placeholder="e.g., Sparring Night"
                    value={form.title}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-lg font-bold">Description</label>
                    <RequiredChip />
                  </div>
                  <RichTextEditor
                    value={form.description}
                    onChange={handleDescriptionChange}
                    compact
                    ariaLabel="Event description"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor="eventDatetime"
                        className="text-lg font-bold"
                      >
                        Date &amp; Time
                      </label>
                      <RequiredChip />
                    </div>
                    <input
                      id="eventDatetime"
                      required
                      type="datetime-local"
                      name="datetime"
                      value={form.datetime}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="eventReleaseDatetime"
                      className="text-lg font-bold"
                    >
                      Release Date &amp; Time
                    </label>
                    <input
                      id="eventReleaseDatetime"
                      type="datetime-local"
                      name="releaseDatetime"
                      value={form.releaseDatetime}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    <span className="text-xs text-gray-400">
                      Leave blank to publish immediately.
                    </span>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="eventCapacity"
                      className="text-lg font-bold"
                    >
                      Capacity
                    </label>
                    <input
                      id="eventCapacity"
                      type="number"
                      name="capacity"
                      min={1}
                      placeholder="Number of participants (optional)"
                      value={form.capacity}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor="eventPrice" className="text-lg font-bold">
                        Ticket Price (NZD)
                      </label>
                      <RequiredChip />
                    </div>
                    <input
                      id="eventPrice"
                      required
                      type="number"
                      name="price"
                      min={0}
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    <span className="text-xs text-gray-400">
                      Use 0 for a free event.
                    </span>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center justify-between gap-4 py-1">
                  <span className="text-lg font-bold">
                    Require sign-up through the website
                  </span>
                  <span className="relative inline-flex shrink-0">
                    <input
                      type="checkbox"
                      name="registrationRequired"
                      checked={form.registrationRequired}
                      onChange={handleRegistrationToggle}
                      className="peer sr-only"
                    />
                    <span className="h-7 w-12 rounded-full bg-gray-300 transition-colors peer-checked:bg-blue-medium peer-focus-visible:ring-2 peer-focus-visible:ring-blue-medium peer-focus-visible:ring-offset-2" />
                    <span className="pointer-events-none absolute left-1 top-1 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                  </span>
                </label>

                {error && (
                  <p className="text-red-600 text-sm font-alan-sans">{error}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center justify-end gap-4 border-t-2 border-yellow-light px-6 py-5 sm:px-10">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="w-auto! cursor-pointer text-blue-medium underline-offset-4 hover:underline disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="button w-auto! disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
