import { useState } from "react";
import { Plus } from "lucide-react";

import { useAuth } from "../auth/useAuth";
import { createSponsor, deleteSponsor } from "../api/sponsorsApi";
import { postImage } from "../api/imageApi";
import { sponsorPageKey } from "../util/sponsors";
import SponsorFormModal, {
  emptySponsorFormValues,
  type SponsorFormValues,
} from "./SponsorFormModal";

interface ModalProps {
  onCreated?: () => void;
}

export default function NewSponsorModal({ onCreated }: Readonly<ModalProps>) {
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<SponsorFormValues>(emptySponsorFormValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = (): void => {
    if (isSubmitting) return;

    setIsOpen(false);
    setForm(emptySponsorFormValues);
    setImageFile(null);
  };

  const updateForm = (field: keyof SponsorFormValues, value: string): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const created = await createSponsor(form);
      console.log("Sponsor created successfully!", created);

      if (imageFile) {
        try {
          await postImage(imageFile, sponsorPageKey(created.name));
        } catch (uploadError) {
          const createdId = created._id ?? created.id;

          if (createdId) {
            try {
              await deleteSponsor(createdId);
            } catch (cleanupError) {
              console.error("Failed to clean up sponsor:", cleanupError);
            }
          }

          throw uploadError;
        }
      }

      onCreated?.();
      setForm(emptySponsorFormValues);
      setImageFile(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error occurred while submitting the sponsor form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (role !== "admin") return null;

  return (
    <div className="my-10 flex justify-center">
      <button
        className="flex cursor-pointer items-center gap-2 rounded-3xl bg-yellow-dark px-8 py-3 font-bold text-blue-medium shadow-[2px_4px] shadow-yellow-medium transition hover:bg-blue-medium hover:text-yellow-light hover:shadow-gray-400"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="size-5" />
        <span>New Sponsor</span>
      </button>

      <SponsorFormModal
        isOpen={isOpen}
        title="New Sponsor"
        submitLabel="Create"
        values={form}
        onChange={updateForm}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onImageChange={setImageFile}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
