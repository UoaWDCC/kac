import { useState } from "react";
import { Plus } from "lucide-react";

import "../style/common.css";
import "../style/about.css";

interface ModalProps {}

export default function Modal({}: ModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // const openModal = (): void => setIsOpen(true);
  const closeModal = (): void => setIsOpen(false);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="add-exec-container">
      <button className="add-exec-button">
        <Plus className="dynamic-size-icon" />
        <p>New Executive</p>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <h2>New Executive</h2>
            <form className="exec-form">
              <div>
                <label>Display Name</label>
                <input type="text" placeholder="e.g., John" />
              </div>

              <div>
                <label>Executive Role</label>
                <input type="text" placeholder="e.g., President" />
              </div>

              <div>
                <label>Full Name</label>
                <input type="text" placeholder="e.g., John Doe" />
              </div>

              <div>
                <label>Description</label>
                <textarea placeholder="Brief description of the executive" />
              </div>

              <button className="contact-button" type="submit">
                Create Executive
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
