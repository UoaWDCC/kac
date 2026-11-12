import { useState } from "react";
import { Plus } from "lucide-react";
import type { CreatedEvent } from "../api/eventsApi";
import EventFormModal from "./EventFormModal";

import "../style/common.css";
import "../style/events.css";

interface CreateEventModalProps {
  onCreated?: (event: CreatedEvent) => void;
}

export default function CreateEventModal({ onCreated }: CreateEventModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="events-pill-button !mb-6.5"
      >
        <Plus size={16} aria-hidden="true" />
        <p>Add Event</p>
      </button>

      {isOpen && (
        <EventFormModal onClose={() => setIsOpen(false)} onSaved={onCreated} />
      )}
    </>
  );
}
