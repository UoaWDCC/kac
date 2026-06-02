import { useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import { deleteContact, updateContact } from "../../api/contactApi";
import type { ContactResponse } from "./ResponseColumns";

type ResponseDetailsModalProps = {
  onClose: () => void;
  onDelete: (id: string) => void;
  onSave: (response: ContactResponse) => void;
  response: ContactResponse;
};

const inputClass =
  "h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-medium focus:ring-2 focus:ring-yellow-dark/40";

const labelClass = "text-sm font-semibold text-slate-700";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
};

export default function ResponseDetailsModal({
  onClose,
  onDelete,
  onSave,
  response,
}: ResponseDetailsModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: response.email,
    message: response.message,
    name: response.name,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const updatedResponse = await updateContact(response._id, form);
      onSave(updatedResponse);
      onClose();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== "delete") return;

    setError(null);
    setIsDeleting(true);

    try {
      await deleteContact(response._id);
      onDelete(response._id);
      onClose();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleManualSave = () => {
    formRef.current?.requestSubmit();
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmation("");
    setShowDeleteConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <section
        aria-label={`Edit response from ${response.name}`}
        aria-modal="true"
        className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
        role="dialog"
      >
        <button
          aria-label="Close response details"
          className="admin-modal-close-button"
          onClick={onClose}
          title="Close"
          type="button"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        <form
          className="min-h-0 flex-1 overflow-y-auto"
          id="response-details-form"
          onSubmit={handleSave}
          ref={formRef}
        >
          <div className="grid gap-5 px-6 py-6">
            {error ? (
              <p className="!m-0 rounded-md border border-red-100 bg-red-50 px-3 py-2 !text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            <section className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
              <div>
                <h3 className="text-base font-bold text-slate-950">
                  Sender details
                </h3>
                <p className="!m-0 mt-1 !text-sm text-slate-500">
                  Contact information attached to this response.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1">
                  <span className={labelClass}>Name</span>
                  <input
                    className={inputClass}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    required
                    value={form.name}
                  />
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>Email (Cannot Edit)</span>
                  <input
                    className={inputClass}
                    required
                    type="email"
                    value={form.email}
                    disabled
                  />
                </label>
              </div>
            </section>

            <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
              <div>
                <h3 className="text-base font-bold text-slate-950">Message</h3>
                <p className="!m-0 mt-1 !text-sm text-slate-500">
                  Full contact form text.
                </p>
              </div>

              <textarea
                className="min-h-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition focus:border-blue-medium focus:ring-2 focus:ring-yellow-dark/40"
                onChange={(event) => updateField("message", event.target.value)}
                required
                value={form.message}
              />
            </section>
          </div>
        </form>

        {showDeleteConfirm ? (
          <div className="admin-delete-confirm-shell">
            <div className="admin-delete-confirm">
              <div className="min-w-0">
                <p className="!m-0 !text-sm font-semibold text-red-800">
                  Delete this response?
                </p>
                <p className="!m-0 mt-1 !text-sm leading-6 text-red-700">
                  This cannot be undone. Type <strong>delete</strong> to enable
                  the delete button.
                </p>
              </div>
              <label className="grid min-w-0 gap-1">
                <span className="sr-only">Type delete to confirm</span>
                <input
                  className={`${inputClass} w-full border-red-200 focus:border-red-500 focus:ring-red-200`}
                  onChange={(event) =>
                    setDeleteConfirmation(event.target.value)
                  }
                  placeholder="Type delete"
                  value={deleteConfirmation}
                />
              </label>
              <button
                aria-label="Close delete confirmation"
                className="admin-delete-confirm-close"
                onClick={closeDeleteConfirm}
                title="Close delete confirmation"
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid shrink-0 grid-cols-1 gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:grid-cols-2 sm:items-start">
          <button
            className="admin-modal-save-button w-full"
            disabled={isSaving}
            onClick={handleManualSave}
            type="button"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          <button
            className="admin-modal-delete-button w-full"
            disabled={
              showDeleteConfirm &&
              (deleteConfirmation !== "delete" || isDeleting)
            }
            onClick={() => {
              if (!showDeleteConfirm) {
                setShowDeleteConfirm(true);
                return;
              }

              void handleDelete();
            }}
            type="button"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete response"}
          </button>
        </div>
      </section>
    </div>
  );
}
