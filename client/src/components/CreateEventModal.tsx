import { useState } from "react";
import { Plus } from "lucide-react";

import "../style/common.css";
import "../style/events.css";

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
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-md rounded-4xl bg-white p-10 shadow-[10px_10px] shadow-yellow-medium">
            <h2 className="text-2xl font-bold text-blue-medium mb-6">
              New Event
            </h2>

            <form className="font-alan-sans flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-lg font-bold">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Sparring Night"
                  className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-bold">Description</label>
                <textarea
                  rows={5}
                  placeholder="What's happening at this event?"
                  className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-bold">Image URL</label>
                <input
                  type="text"
                  placeholder="e.g., src/images/event.png"
                  className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-bold">Date &amp; Time</label>
                <input
                  type="datetime-local"
                  className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-bold">Capacity</label>
                <input
                  type="number"
                  min={1}
                  placeholder="Leave blank for no limit"
                  className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                />
              </div>

              <button type="submit" className="button self-center">
                Create Event
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
