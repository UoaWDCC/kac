import { useState } from "react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="!m-0 !text-sm font-semibold uppercase tracking-normal text-slate-500">
              View/Edit Response
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {response.name}
            </h2>
          </div>
          <button
            aria-label="Close response details"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            onClick={onClose}
            title="Close"
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <form className="grid gap-5 px-5 py-5" onSubmit={handleSave}>
          {error ? (
            <p className="!m-0 rounded-md border border-red-100 bg-red-50 px-3 py-2 !text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1">
              <span className={labelClass}>Name</span>
              <input
                className={inputClass}
                onChange={(event) => updateField("name", event.target.value)}
                required
                value={form.name}
              />
            </label>

            <label className="grid gap-1">
              <span className={labelClass}>Email</span>
              <input
                className={inputClass}
                onChange={(event) => updateField("email", event.target.value)}
                required
                type="email"
                value={form.email}
              />
            </label>
          </div>

          <label className="grid gap-1">
            <span className={labelClass}>Message</span>
            <textarea
              className="min-h-56 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition focus:border-blue-medium focus:ring-2 focus:ring-yellow-dark/40"
              onChange={(event) => updateField("message", event.target.value)}
              required
              value={form.message}
            />
          </label>

          <div className="rounded-md border border-red-100 bg-red-50 p-4">
            <button
              className="inline-flex h-10 items-center gap-2 rounded-md border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              onClick={() => setShowDeleteConfirm((current) => !current)}
              type="button"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Delete response
            </button>

            {showDeleteConfirm ? (
              <div className="mt-3 grid gap-3">
                <p className="!m-0 !text-sm leading-6 text-red-700">
                  Are you sure you want to delete this response? Type{" "}
                  <strong>delete</strong> to confirm.
                </p>
                <input
                  className={inputClass}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  placeholder="Type delete"
                  value={deleteConfirmation}
                />
                <button
                  className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-red-700 px-4 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={deleteConfirmation !== "delete" || isDeleting}
                  onClick={handleDelete}
                  type="button"
                >
                  {isDeleting ? "Deleting..." : "Confirm delete"}
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            <button
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex h-10 items-center justify-center rounded-md bg-blue-medium px-4 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
