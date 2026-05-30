import { useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import { deleteMember, updateMember } from "../../api/usersApi";
import type { Member } from "./MemberColumns";

type MemberDetailsModalProps = {
  adminCount: number;
  isCurrentUser: boolean;
  member: Member;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSave: (member: Member) => void;
};

const FACULTIES = [
  "Arts",
  "Business School",
  "Creative Arts and Industries",
  "Education and Social Work",
  "Engineering",
  "Law",
  "Medical and Health Sciences",
  "Science",
];

const inputClass =
  "h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-medium focus:ring-2 focus:ring-yellow-dark/40";

const labelClass = "text-sm font-semibold text-slate-700";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
};

export default function MemberDetailsModal({
  adminCount,
  isCurrentUser,
  member,
  onClose,
  onDelete,
  onSave,
}: MemberDetailsModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    email: member.email,
    faculties: member.faculties,
    firstName: member.firstName,
    isAdmin: member.isAdmin,
    lastName: member.lastName,
    latestMembershipYear:
      member.latestMembershipYear === null ? "" : String(member.latestMembershipYear),
    mobileNumber: member.mobileNumber,
    pronouns: member.pronouns ?? "",
    studentId: member.studentId,
    university: member.university,
    upi: member.upi,
    yearOfStudy: String(member.yearOfStudy),
  });
  const isOnlyAdmin = member.isAdmin && adminCount <= 1;
  const adminChangeBlockedReason = isCurrentUser
    ? "You cannot remove admin access from your own account."
    : isOnlyAdmin
      ? "At least one admin account must remain."
      : null;
  const deleteBlockedReason = isCurrentUser
    ? "You cannot delete your own admin account."
    : isOnlyAdmin
      ? "At least one admin account must remain."
      : null;

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleFaculty = (faculty: string) => {
    setForm((current) => ({
      ...current,
      faculties: current.faculties.includes(faculty)
        ? current.faculties.filter((item) => item !== faculty)
        : [...current.faculties, faculty],
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.isAdmin && adminChangeBlockedReason) {
      setError(adminChangeBlockedReason);
      return;
    }

    if (form.faculties.length === 0) {
      setError("Select at least one faculty.");
      return;
    }

    setIsSaving(true);

    try {
      const updatedMember = await updateMember(member._id, {
        ...form,
        latestMembershipYear: form.latestMembershipYear
          ? Number(form.latestMembershipYear)
          : null,
        yearOfStudy: Number(form.yearOfStudy),
      });

      onSave(updatedMember);
      onClose();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteBlockedReason) {
      setError(deleteBlockedReason);
      return;
    }

    if (deleteConfirmation !== "delete") return;

    setError(null);
    setIsDeleting(true);

    try {
      await deleteMember(member._id);
      onDelete(member._id);
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
  const isDeleteDisabled =
    Boolean(deleteBlockedReason) ||
    (showDeleteConfirm && (deleteConfirmation !== "delete" || isDeleting));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <section
        aria-label={`Edit member ${member.firstName} ${member.lastName}`}
        aria-modal="true"
        className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
        role="dialog"
      >
        <button
          aria-label="Close member details"
          className="admin-modal-close-button"
          onClick={onClose}
          title="Close"
          type="button"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        <form
          className="min-h-0 flex-1 overflow-y-auto"
          id="member-details-form"
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
                  Contact details
                </h3>
                <p className="!m-0 mt-1 !text-sm text-slate-500">
                  Core identity and contact information.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1">
                  <span className={labelClass}>First name</span>
                  <input
                    className={inputClass}
                    onChange={(event) =>
                      updateField("firstName", event.target.value)
                    }
                    required
                    value={form.firstName}
                  />
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>Last name</span>
                  <input
                    className={inputClass}
                    onChange={(event) =>
                      updateField("lastName", event.target.value)
                    }
                    required
                    value={form.lastName}
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

                <label className="grid gap-1">
                  <span className={labelClass}>Mobile number</span>
                  <input
                    className={inputClass}
                    onChange={(event) =>
                      updateField("mobileNumber", event.target.value)
                    }
                    required
                    value={form.mobileNumber}
                  />
                </label>

                <label className="grid gap-1 md:col-span-2">
                  <span className={labelClass}>Pronouns</span>
                  <input
                    className={inputClass}
                    onChange={(event) =>
                      updateField("pronouns", event.target.value)
                    }
                    value={form.pronouns}
                  />
                </label>
              </div>
            </section>

            <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
              <div>
                <h3 className="text-base font-bold text-slate-950">
                  Academic details
                </h3>
                <p className="!m-0 mt-1 !text-sm text-slate-500">
                  Student identifiers, study year, and faculties.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1">
                  <span className={labelClass}>University</span>
                  <input
                    className={inputClass}
                    onChange={(event) =>
                      updateField("university", event.target.value)
                    }
                    required
                    value={form.university}
                  />
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>UPI</span>
                  <input
                    className={inputClass}
                    onChange={(event) => updateField("upi", event.target.value)}
                    required
                    value={form.upi}
                  />
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>Student ID</span>
                  <input
                    className={inputClass}
                    onChange={(event) =>
                      updateField("studentId", event.target.value)
                    }
                    required
                    value={form.studentId}
                  />
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>Year of study</span>
                  <input
                    className={inputClass}
                    min="1"
                    onChange={(event) =>
                      updateField("yearOfStudy", event.target.value)
                    }
                    required
                    type="number"
                    value={form.yearOfStudy}
                  />
                </label>

                <label className="grid gap-1 md:col-span-2">
                  <span className={labelClass}>Membership year</span>
                  <input
                    className={inputClass}
                    onChange={(event) =>
                      updateField("latestMembershipYear", event.target.value)
                    }
                    placeholder="No year"
                    type="number"
                    value={form.latestMembershipYear}
                  />
                </label>
              </div>

              <div className="grid gap-2">
                <span className={labelClass}>Faculties</span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {FACULTIES.map((faculty) => (
                    <label
                      className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300"
                      key={faculty}
                    >
                      <input
                        checked={form.faculties.includes(faculty)}
                        className="h-4 w-4 accent-blue-medium"
                        onChange={() => toggleFaculty(faculty)}
                        type="checkbox"
                      />
                      {faculty}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="text-base font-bold text-slate-950">Access</h3>
              <label
                className={`flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold ${
                  adminChangeBlockedReason
                    ? "bg-slate-50 text-slate-500"
                    : "text-slate-700"
                }`}
              >
                <input
                  checked={form.isAdmin}
                  className="h-4 w-4 accent-blue-medium disabled:cursor-not-allowed"
                  disabled={Boolean(adminChangeBlockedReason)}
                  onChange={(event) =>
                    updateField("isAdmin", event.target.checked)
                  }
                  type="checkbox"
                />
                Admin user
              </label>
              {adminChangeBlockedReason ? (
                <p className="!m-0 !text-sm text-slate-500">
                  {adminChangeBlockedReason}
                </p>
              ) : null}
            </section>
          </div>
        </form>

        {showDeleteConfirm ? (
          <div className="admin-delete-confirm-shell">
            <div className="admin-delete-confirm">
              <div className="min-w-0">
                <p className="!m-0 !text-sm font-semibold text-red-800">
                  Delete this member?
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
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
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
          <div className="grid gap-1">
            <button
              className="admin-modal-delete-button w-full"
              disabled={isDeleteDisabled}
              onClick={() => {
                if (deleteBlockedReason) {
                  setError(deleteBlockedReason);
                  return;
                }

                if (!showDeleteConfirm) {
                  setShowDeleteConfirm(true);
                  return;
                }

                void handleDelete();
              }}
              title={deleteBlockedReason ?? undefined}
              type="button"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete member"}
            </button>
            {deleteBlockedReason ? (
              <p className="!m-0 max-w-xs !text-xs text-slate-500">
                {deleteBlockedReason}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
