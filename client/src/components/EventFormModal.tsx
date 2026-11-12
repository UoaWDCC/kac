import { useState } from "react";
import { X } from "lucide-react";
import { createEvent, updateEvent } from "../api/eventsApi";
import type { CreatedEvent, Event, EventUpdate } from "../api/eventsApi";
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

const toDateTimeLocal = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (input: number) => String(input).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toFormState = (event?: CreatedEvent | null) =>
  event
    ? {
        title: event.title ?? "",
        description: event.description ?? "",
        datetime: toDateTimeLocal(event.datetime),
        capacity: event.capacity != null ? String(event.capacity) : "",
        price: String(event.price ?? 0),
        releaseDatetime: toDateTimeLocal(event.releaseDatetime),
        registrationRequired: event.registrationRequired !== false,
      }
    : emptyForm;

interface EventFormModalProps {
  event?: CreatedEvent | null;
  onClose: () => void;
  onSaved?: (event: CreatedEvent) => void;
}

export default function EventFormModal({
  event,
  onClose,
  onSaved,
}: EventFormModalProps) {
  const isEditing = Boolean(event);
  const [form, setForm] = useState(() => toFormState(event));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mouseDownOnOverlay, setMouseDownOnOverlay] = useState(false);

  const closeModal = () => {
    if (submitting) return;
    onClose();
  };

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

    let capacity: number | null = null;
    if (form.capacity.trim() !== "") {
      const parsed = Number(form.capacity);
      if (!Number.isInteger(parsed) || parsed < 1) {
        setError("Capacity must be 1 or more.");
        return;
      }
      capacity = parsed;
    }

    let releaseDatetime: string | null = null;
    if (form.releaseDatetime.trim() !== "") {
      const release = new Date(form.releaseDatetime);
      const eventDate = new Date(form.datetime);
      if (release.getTime() > eventDate.getTime()) {
        setError("Release date can't be after the event itself.");
        return;
      }
      releaseDatetime = release.toISOString();
    }

    const base = {
      title,
      description,
      datetime: new Date(form.datetime).toISOString(),
      price: Number(form.price),
      registrationRequired: form.registrationRequired,
    };

    setSubmitting(true);
    try {
      let saved: CreatedEvent;

      if (event) {
        const payload: EventUpdate = {
          ...base,
          capacity,
          releaseDatetime,
        };
        saved = await updateEvent(event._id, payload);
      } else {
        const payload: Event = { ...base };
        if (capacity !== null) payload.capacity = capacity;
        if (releaseDatetime !== null) payload.releaseDatetime = releaseDatetime;
        saved = await createEvent(payload);
      }

      onSaved?.(saved);
      onClose();
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "Failed to save event. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onMouseDown={handleOverlayMouseDown}
      onMouseUp={handleOverlayMouseUp}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-form-title"
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-4xl bg-white shadow-[10px_10px] shadow-yellow-medium"
      >
        <div className="shrink-0 border-b-2 border-yellow-light">
          <div className="flex w-full items-center justify-between gap-4 px-6 py-5 sm:px-10 sm:py-6">
            <h2
              id="event-form-title"
              className="min-w-0 flex-1 whitespace-nowrap text-2xl font-bold text-blue-medium"
            >
              {isEditing ? "Edit Event" : "New Event"}
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

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
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
                  <label htmlFor="eventDatetime" className="text-lg font-bold">
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
                <label htmlFor="eventCapacity" className="text-lg font-bold">
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
              {submitting
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
