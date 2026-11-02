import type { MouseEvent } from "react";

export interface SponsorFormValues {
  name: string;
  description: string;
  category: "cbd" | "newmarket" | "other";
}

export const emptySponsorFormValues: SponsorFormValues = {
  name: "",
  description: "",
  category: "cbd",
};

interface SponsorFormModalProps {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  values: SponsorFormValues;
  onChange: (field: keyof SponsorFormValues, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  onImageChange: (file: File | null) => void;
  isSubmitting?: boolean;
}

const inputClassName =
  "w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none";

const renderTextField = (
  label: string,
  field: keyof SponsorFormValues,
  values: SponsorFormValues,
  onChange: (field: keyof SponsorFormValues, value: string) => void,
  fullWidth = true
) => (
  <div
    className={fullWidth ? "flex flex-col gap-1 w-full" : "flex flex-col gap-1"}
  >
    <h3 className="text-lg font-bold">{label}</h3>
    <input
      id={field}
      type="text"
      value={values[field]}
      onChange={(e) => onChange(field, e.target.value)}
      className={
        fullWidth
          ? inputClassName
          : "w-fit py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
      }
    />
  </div>
);

export default function SponsorFormModal({
  isOpen,
  title,
  submitLabel,
  values,
  onChange,
  onImageChange,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Readonly<SponsorFormModalProps>) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end justify-center sm:items-center z-10"
      onClick={handleOverlayClick}
    >
      <div className="font-alan-sans text-sm text-left bg-white rounded-t-2xl sm:rounded-2xl pr-6 pt-8 relative border-box min-w-screen sm:min-w-[48vw] h-fit max-h-[70vh] lg:max-h-[90vh] flex flex-col gap-6">
        <div className="overflow-y-auto pl-12 pr-6">
          <h2 className="text-2xl! font-bold pb-6">{title}</h2>
          <form className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold">Add Image</h3>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="cursor-pointer rounded-md border-2 border-yellow-dark bg-yellow-light px-3 py-2 text-blue-medium disabled:cursor-not-allowed disabled:opacity-60 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-yellow-dark file:px-3 file:py-1 file:font-bold file:text-blue-medium disabled:file:cursor-not-allowed"
                disabled={isSubmitting}
                onChange={(event) =>
                  onImageChange(event.target.files?.[0] ?? null)
                }
              />
            </div>
            {renderTextField("Sponsor Name", "name", values, onChange)}
            {renderTextField("Description", "description", values, onChange)}

            <div className="flex flex-col gap-1 w-full">
              <h3 className="text-lg font-bold">Category</h3>
              <select
                id="category"
                value={values.category}
                onChange={(e) =>
                  onChange(
                    "category",
                    e.target.value as "cbd" | "newmarket" | "other"
                  )
                }

                className={inputClassName}
              >
                <option value="" className="text-gray-500">
                  -- Please choose a group --
                </option>
                <option value="cbd">CBD</option>
                <option value="newmarket">New Market</option>
                <option value="other">Other</option>
              </select>
            </div>
          </form>
        </div>

        <div className="flex justify-center py-8">
          <button
            className="cursor-pointer px-12 w-fit! h-10 rounded-3xl font-bold text-lg text-blue-medium hover:text-yellow-light bg-yellow-dark! hover:bg-blue-medium! duration-200 shadow-[2px_4px] shadow-yellow-medium hover:shadow-gray-400"
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
