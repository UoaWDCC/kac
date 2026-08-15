import { useState } from "react";
import { Plus } from "lucide-react";

import "../style/common.css";
import "../style/about.css";

interface ModalProps {}

export default function Modal({}: ModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = (): void => setIsOpen(true);
  const closeModal = (): void => setIsOpen(false);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="add-exec-container">
      <button className="add-exec-button" type="button" onClick={openModal}>
        <Plus className="dynamic-size-icon" />
        <p>New Executive</p>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 background-blur flex items-center justify-center z-1000"
          onClick={handleOverlayClick}
        >
          <div className="font-alan-sans bg-white rounded-2xl px-16 py-10 justify-center relative border-box min-w-[36vw] h-fit flex flex-col gap-6">
            <h2 className="text-2xl! font-bold">New Executive</h2>
            <form className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold">Name</h3>
                <input
                  type="text"
                  placeholder="Kaco"
                  className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold">Role</h3>
                <input
                  type="text"
                  placeholder="Mascot"
                  className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold">Description</h3>
                <textarea
                  cols={50}
                  rows={2}
                  wrap="hard"
                  placeholder="Kaco is the mascot of the Kiwi Asian Club..."
                  className="resize-none w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                ></textarea>
              </div>
            </form>
            <div className="flex justify-center mt-4">
              <button
                className="cursor-pointer py-2 px-12 w-fit! h-10 rounded-3xl text-blue-medium hover:text-yellow-light bg-yellow-dark! hover:bg-blue-medium! duration-200 shadow-[2px_4px] shadow-yellow-medium hover:shadow-gray-400"
                type="submit"
                onClick={closeModal}
              >
                Create!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
