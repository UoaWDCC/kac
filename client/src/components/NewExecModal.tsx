import { useState } from "react";
import { Plus } from "lucide-react";

import "../style/common.css";
import "../style/about.css";

import { useAuth } from "../auth/useAuth";
import { createExec, deleteExec } from "../api/execsApi";
import ExecFormModal, {
  emptyExecFormValues,
  type ExecFormValues,
} from "./ExecFormModal";
import { postImage } from "../api/imageApi";

interface ModalProps {
  onCreated?: () => void;
}

export default function Modal({ onCreated }: Readonly<ModalProps>) {
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [form, setForm] = useState<ExecFormValues>(emptyExecFormValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (): void => setIsOpen(true);
  const closeModal = (): void => {
    if (isSubmitting) return;

    setIsOpen(false);
    setForm(emptyExecFormValues);
    setImageFile(null);
  };

  const updateForm = (field: keyof ExecFormValues, value: string): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const imageURL = "exec-placeholder";
      const created = await createExec({
        imageURL,
        ...form,
      });
      console.log("Exec created successfully!", created);

      if (imageFile) {
        try {
          await postImage(imageFile, created.imageURL);
        } catch (uploadError) {
          const createdId = created.id ?? created._id;

          if (createdId) {
            try {
              await deleteExec(createdId);
            } catch (cleanupError) {
              console.error("Failed to clean up executive:", cleanupError);
            }
          }

          throw uploadError;
        }
      }

      onCreated?.();
      setForm(emptyExecFormValues);
      setImageFile(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            onImageChange={setImageFile}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
