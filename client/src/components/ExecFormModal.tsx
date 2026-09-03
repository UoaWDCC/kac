import type { MouseEvent } from "react";

export interface ExecFormValues {
  displayName: string;
  execRole: string;
  roleGroup: string;
  ethnicity: string;
  degree: string;
  mbti: string;
  fact: string;
  sponsor: string;
  greenFlag: string;
  redFlag: string;
  emojis: string;
}

export const emptyExecFormValues: ExecFormValues = {
  displayName: "",
  execRole: "",
  roleGroup: "",
  ethnicity: "",
  degree: "",
  mbti: "",
  fact: "",
  sponsor: "",
  greenFlag: "",
  redFlag: "",
  emojis: "",
};

interface ExecFormModalProps {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  values: ExecFormValues;
  onChange: (field: keyof ExecFormValues, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const inputClassName =
  "w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none";

const renderTextField = (
  label: string,
  field: keyof ExecFormValues,
  values: ExecFormValues,
  onChange: (field: keyof ExecFormValues, value: string) => void,
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

export default function ExecFormModal({
  isOpen,
  title,
  submitLabel,
  values,
  onChange,
  onClose,
  onSubmit,
}: Readonly<ExecFormModalProps>) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000"
      onClick={handleOverlayClick}
    >
      <div className="font-alan-sans text-sm bg-white rounded-2xl pr-6 pt-8 justify-center relative border-box min-w-[48vw] h-fit max-h-[90vh] flex flex-col gap-6">
        <div className="overflow-y-auto pl-12 pr-6">
          <h2 className="text-2xl! font-bold pb-6">{title}</h2>
          <form className="flex flex-col gap-8">
            <div className="flex flex-row gap-10">
              {renderTextField("Display Name", "displayName", values, onChange)}
              {renderTextField("Executive Role", "execRole", values, onChange)}
            </div>

            <div className="flex flex-row gap-10">
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg font-bold">Role Group</h3>
                <select
                  id="roleGroup"
                  value={values.roleGroup}
                  onChange={(e) => onChange("roleGroup", e.target.value)}
                  className={inputClassName}
                >
                  <option value="" className="text-gray-500">
                    -- Please choose a group --
                  </option>
                  <option value="president">President</option>
                  <option value="admin">Admin</option>
                  <option value="events">Events</option>
                  <option value="public-relations">Public Relations</option>
                  <option value="marketing">Marketing</option>
                  <option value="aesir-representative">
                    Aesir Representative
                  </option>
                </select>
              </div>

              {renderTextField("Ethnicity", "ethnicity", values, onChange)}
            </div>

            {renderTextField("Degree", "degree", values, onChange)}

            <div className="flex flex-row gap-10">
              {renderTextField("Fun Fact", "fact", values, onChange)}
              {renderTextField("MBTI", "mbti", values, onChange)}
            </div>

            {renderTextField(
              "Favourite KAC Sponsor",
              "sponsor",
              values,
              onChange
            )}

            <div className="flex flex-row gap-10">
              {renderTextField("Red Flag", "redFlag", values, onChange)}
              {renderTextField("Green Flag", "greenFlag", values, onChange)}
            </div>

            {renderTextField(
              "Favourite Emojis",
              "emojis",
              values,
              onChange,
              false
            )}
          </form>
        </div>

        <div className="flex justify-center pb-8">
          <button
            className="cursor-pointer px-12 w-fit! h-10 rounded-3xl font-bold text-lg text-blue-medium hover:text-yellow-light bg-yellow-dark! hover:bg-blue-medium! duration-200 shadow-[2px_4px] shadow-yellow-medium hover:shadow-gray-400"
            type="button"
            onClick={onSubmit}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
