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
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <button className="add-exec-button" onClick={openModal}>
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

              <div>
                <label>Ethnicity</label>
                <input type="text" placeholder="Optional" />
              </div>

              <div>
                <label>Degree</label>
                <input type="text" placeholder="Optional" />
              </div>

              <div>
                <label>MBTI</label>
                <input type="text" placeholder="e.g., ENFP" />
              </div>

              <div>
                <label>Fun Fact</label>
                <input type="text" placeholder="Something fun!" />
              </div>

              <div>
                <label>Favourite KAC Sponsor</label>
                <input type="text" placeholder="Optional" />
              </div>

              <div>
                <label>Green Flag ✅</label>
                <input type="text" placeholder="" />
              </div>

              <div>
                <label>Red Flag 🚩</label>
                <input type="text" placeholder="" />
              </div>

              <div>
                <label>Favourite Emojis</label>
                <input type="text" placeholder="e.g., 🎉 🚀 ⭐" />
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
