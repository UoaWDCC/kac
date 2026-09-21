import { useEffect, useState } from "react";

import "../style/common.css";
import "../style/about.css";

import { useAuth } from "../auth/useAuth";
import { editExec } from "../api/execsApi";
import ExecFormModal, {
  emptyExecFormValues,
  type ExecFormValues,
} from "./ExecFormModal";
import { postImage } from "../api/imageApi";

interface Executive {
  id: string;
  imageURL: string;
  displayName: string;
  execRole: string;
  roleGroup?: string;
  description: string;
  fullName: string;
  ethnicity: string;
  degree: string;
  mbti: string;
  fact: string;
  sponsor: string;
  greenFlag: string;
  redFlag: string;
  emojis: string;
}

interface ModalProps {
  exec: Executive | null;
  onClose: () => void;
  onEdited?: () => void;
}

export default function Modal({
  exec,
  onClose,
  onEdited,
}: Readonly<ModalProps>) {
  const { role } = useAuth();
  const [form, setForm] = useState<ExecFormValues>(emptyExecFormValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!exec) return;
    setImageFile(null);
    setForm({
      displayName: exec.displayName ?? "",
      execRole: exec.execRole ?? "",
      roleGroup: exec.roleGroup ?? "",
      ethnicity: exec.ethnicity ?? "",
      degree: exec.degree ?? "",
      mbti: exec.mbti ?? "",
      fact: exec.fact ?? "",
      sponsor: exec.sponsor ?? "",
      greenFlag: exec.greenFlag ?? "",
      redFlag: exec.redFlag ?? "",
      emojis: exec.emojis ?? "",
    });
  }, [exec]);

  const updateForm = (field: keyof ExecFormValues, value: string): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!exec || isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (!exec.id) return;

      const imageURL = exec.imageURL;

      if (imageFile) {
        await postImage(imageFile, exec.imageURL);
      }

      const edited = await editExec(exec.id, {
        imageURL,
        ...form,
      });
      console.log("Exec updated successfully!", edited);

      onEdited?.();
      onClose();
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!exec || role !== "admin") {
    return null;
  }

  return (
    <ExecFormModal
      isOpen
      title="Edit Executive"
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
