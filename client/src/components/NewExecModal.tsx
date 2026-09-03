import { useState } from "react";
import { Plus } from "lucide-react";

import "../style/common.css";
import "../style/about.css";

import { useAuth } from "../auth/useAuth";
import { createExec } from "../api/execsApi";
import ExecFormModal, {
  emptyExecFormValues,
  type ExecFormValues,
} from "./ExecFormModal";

interface ModalProps {
  onCreated?: () => void;
}

export default function Modal({ onCreated }: Readonly<ModalProps>) {
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [form, setForm] = useState<ExecFormValues>(emptyExecFormValues);

  const openModal = (): void => setIsOpen(true);
  const closeModal = (): void => setIsOpen(false);

  const updateForm = (field: keyof ExecFormValues, value: string): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const imageURL = "src/images/exec-placeholder.png";
      const created = await createExec({
        imageURL,
        ...form,
      });
      console.log("Exec created successfully!", created);

      if (onCreated) onCreated();
      setForm(emptyExecFormValues);
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
    }
    closeModal();
  };

  return (
    <div>
      {role === "admin" && (
        <div className="add-exec-container my-16">
          <button className="add-exec-button" type="button" onClick={openModal}>
            <Plus className="dynamic-size-icon" />
            <p>New Executive</p>
          </button>

          <ExecFormModal
            isOpen={isOpen}
            title="New Executive"
            submitLabel="Create"
            values={form}
            onChange={updateForm}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}
