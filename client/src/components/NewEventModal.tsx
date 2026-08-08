import { useState } from "react";
import { Plus } from "lucide-react";

export default function CreateEventModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <button type="button" onClick={openModal}>
        <Plus />
        <p>Add Event</p>
      </button>

      {isOpen && (
        <div onClick={handleOverlayClick}>
          <div>
            <h2>New Event</h2>
            <form>
              <div>
                <label>Title</label>
                <input type="text" />
              </div>

              <div>
                <label>Description</label>
                <textarea />
              </div>

              <div>
                <label>Image URL</label>
                <input type="text" />
              </div>

              <div>
                <label>Date &amp; Time</label>
                <input type="datetime-local" />
              </div>

              <div>
                <label>Capacity</label>
                <input type="number" />
              </div>

              <button type="submit">Create Event</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
