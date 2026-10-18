import { useEffect, useState } from "react";

import { useAuth } from "../auth/useAuth";
import { updateSponsor } from "../api/sponsorsApi";
import { postImage } from "../api/imageApi";
import { sponsorPageKey, type Sponsor } from "../util/sponsors";
import SponsorFormModal, {
  emptySponsorFormValues,
  type SponsorFormValues,
} from "./SponsorFormModal";

interface EditableSponsor extends Sponsor {
  _id: string;
}

interface ModalProps {
  sponsor: EditableSponsor | null;
  onClose: () => void;
  onEdited?: () => void;
}

export default function EditSponsorModal({
  sponsor,
  onClose,
  onEdited,
}: Readonly<ModalProps>) {
  const { role } = useAuth();
  const [form, setForm] = useState<SponsorFormValues>(emptySponsorFormValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!sponsor) return;

    setImageFile(null);
    setForm({
      name: sponsor.name ?? "",
      description: sponsor.description ?? "",
      category: sponsor.category ?? "other",
    });
  }, [sponsor]);

  const updateForm = (field: keyof SponsorFormValues, value: string): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!sponsor || isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (imageFile) {
        await postImage(imageFile, sponsorPageKey(form.name));
      }

      const edited = await updateSponsor(sponsor._id, form);
      console.log("Sponsor updated successfully!", edited);

      onEdited?.();
      onClose();
    } catch (error) {
      console.error("Error occurred while submitting the sponsor form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sponsor || role !== "admin") return null;

  return (
    <SponsorFormModal
      isOpen
      title="Edit Sponsor"
      submitLabel="Confirm"
      values={form}
      onChange={updateForm}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onImageChange={setImageFile}
      isSubmitting={isSubmitting}
    />
  );
}
