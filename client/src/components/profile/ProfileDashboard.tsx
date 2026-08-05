import type { ProfileSection } from "../../pages/Profile.tsx";
import { CalendarDays, ChevronRight, Images } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCurrentMember, updateCurrentMember } from "../../api/usersApi";
import { FACULTIES } from "../../constants/faculties";
import {
  filterMemberFieldInput,
  getMemberInputProps,
  getMemberValidationErrors,
  normalizeMemberProfile,
} from "../../util/memberValidation";

// TODO: replace with dynamic link fetched from admin dashboard once implemented
const PASS2U_LINK =
  "https://www.pass2u.net/p/mZvjfJH6V37n?openExternalBrowser=1";

type ProfileDashboardProps = {
  activeSection: ProfileSection;
};

type CurrentMember = {
  createdAt?: string;
  email?: string;
  faculties?: string[];
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  pronouns?: string;
  studentId?: string;
  university?: string;
  upi?: string;
};

type ProfileForm = {
  email: string;
  faculties: string[];
  firstName: string;
  lastName: string;
  memberSince: string;
  mobileNumber: string;
  pronouns: string;
  studentId: string;
  university: string;
  upi: string;
};

type ProfileTextField = Exclude<keyof ProfileForm, "faculties">;

type ProfileField = {
  id: string;
  label: string;
  name: ProfileTextField;
  readOnly?: boolean;
};

const emptyProfileForm: ProfileForm = {
  email: "",
  faculties: [],
  firstName: "",
  lastName: "",
  memberSince: "",
  mobileNumber: "",
  pronouns: "",
  studentId: "",
  university: "",
  upi: "",
};

const formatMemberSince = (createdAt?: string) => {
  if (!createdAt) return "";

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const createProfileForm = (currentUser: CurrentMember): ProfileForm => ({
  email: currentUser.email ?? "",
  faculties: currentUser.faculties ?? [],
  firstName: currentUser.firstName ?? "",
  lastName: currentUser.lastName ?? "",
  memberSince: formatMemberSince(currentUser.createdAt),
  mobileNumber: currentUser.mobileNumber ?? "",
  pronouns: currentUser.pronouns ?? "",
  studentId: currentUser.studentId ?? "",
  university: currentUser.university ?? "",
  upi: currentUser.upi ?? "",
});

const profileFields: ProfileField[] = [
  {
    id: "first-name",
    label: "First Name",
    name: "firstName",
  },
  {
    id: "university",
    label: "University",
    name: "university",
  },
  { id: "last-name", label: "Last Name", name: "lastName" },
  { id: "upi", label: "Student Username / UPI", name: "upi" },
  {
    id: "email",
    label: "Email Address",
    name: "email",
    readOnly: true,
  },
  {
    id: "student-number",
    label: "Student Number",
    name: "studentId",
  },
  {
    id: "phone",
    label: "Phone Number",
    name: "mobileNumber",
  },
  { id: "pronouns", label: "Pronouns", name: "pronouns" },
];

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
};

const attendedEvents = [
  "Event Name Here",
  "Event Name Here",
  "Event Name Here",
  "Event Name Here",
];

export default function ProfileDashboard({
  activeSection,
}: ProfileDashboardProps) {
  const [currentUser, setCurrentUser] = useState<CurrentMember | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyProfileForm);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        const member = await fetchCurrentMember();

        if (isMounted) {
          setCurrentUser(member);
          setForm(createProfileForm(member));
        }
      } catch (error) {
        console.error("Failed to load current member:", error);
        setError(getErrorMessage(error));
      }
    };

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (field: ProfileTextField, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: filterMemberFieldInput(field, value),
    }));
    setError(null);
    setSuccessMessage(null);
  };

  const toggleFaculty = (faculty: string) => {
    setForm((current) => ({
      ...current,
      faculties: current.faculties.includes(faculty)
        ? current.faculties.filter((item) => item !== faculty)
        : [...current.faculties, faculty],
    }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentUser) {
      setError("Profile details are still loading.");
      return;
    }

    const normalizedForm = normalizeMemberProfile(form);
    const validationErrors = getMemberValidationErrors(normalizedForm);

    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const updatedMember = await updateCurrentMember({
        faculties: normalizedForm.faculties,
        firstName: normalizedForm.firstName,
        lastName: normalizedForm.lastName,
        mobileNumber: normalizedForm.mobileNumber,
        pronouns: normalizedForm.pronouns,
        studentId: normalizedForm.studentId,
        university: normalizedForm.university,
        upi: normalizedForm.upi,
      });

      setCurrentUser(updatedMember);
      setForm(createProfileForm(updatedMember));
      setSuccessMessage("Details updated.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-w-0">
      {activeSection === "profile" && (
        <section className="rounded-[1.35rem] bg-white px-8 py-10 shadow-[6px_6px_0_var(--color-yellow-medium)] sm:px-12 lg:min-h-[36.5rem]">
          <h2 className="mb-9 mt-0 font-sans text-2xl font-bold text-blue-medium">
            My Details
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-x-12 gap-y-5 md:grid-cols-2">
              {profileFields.map((detail) => (
                <label
                  key={detail.id}
                  className="flex flex-col gap-1 font-alan-sans text-[0.94rem] font-semibold text-grey-medium"
                  htmlFor={detail.id}
                >
                  {detail.label}
                  <input
                    {...getMemberInputProps(detail.name)}
                    className={`w-full border-0 border-b-2 border-yellow-dark bg-transparent px-0 pb-1 font-alan-sans text-base font-semibold text-blue-medium outline-none ${
                      detail.readOnly
                        ? "cursor-not-allowed text-grey-medium"
                        : "focus:border-blue-medium"
                    }`}
                    id={detail.id}
                    onChange={(event) =>
                      updateField(detail.name, event.target.value)
                    }
                    readOnly={detail.readOnly || isSaving}
                    value={form[detail.name]}
                  />
                </label>
              ))}
              <div className="flex flex-col gap-2 font-alan-sans text-[0.94rem] font-semibold text-grey-medium md:col-span-2">
                <span>Faculties</span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {FACULTIES.map((faculty) => (
                    <label
                      className="flex items-center gap-3 rounded-md border border-yellow-dark/70 bg-transparent px-3 py-2 text-base font-semibold text-blue-medium transition hover:border-blue-medium"
                      key={faculty}
                    >
                      <input
                        checked={form.faculties.includes(faculty)}
                        className="h-4 w-4 accent-blue-medium"
                        disabled={isSaving}
                        onChange={() => toggleFaculty(faculty)}
                        type="checkbox"
                      />
                      {faculty}
                    </label>
                  ))}
                </div>
              </div>

              <label
                className="flex flex-col gap-1 font-alan-sans text-[0.94rem] font-semibold text-grey-medium md:col-span-2"
                htmlFor="member-since"
              >
                Member Since
                <input
                  {...getMemberInputProps("memberSince")}
                  className="w-full cursor-not-allowed border-0 border-b-2 border-yellow-dark bg-transparent px-0 pb-1 font-alan-sans text-base font-semibold text-grey-medium outline-none"
                  id="member-since"
                  readOnly
                  value={form.memberSince}
                />
              </label>
              
              <label
                className="flex flex-col gap-1 font-alan-sans text-[0.94rem] font-semibold text-grey-medium md:col-span-2"
                htmlFor="member-since"
              >
                Digital Membership Card
                <a
                  href={PASS2U_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button w-fit!"
                >
                  Add to Wallet
                </a>
              </label>
            </div>

            {error ? (
              <p className="!mb-0 mt-6 !text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            {successMessage ? (
              <p className="!mb-0 mt-6 !text-sm font-semibold text-blue-medium">
                {successMessage}
              </p>
            ) : null}

            <div className="mt-12 flex justify-center">
              <button
                className="button"
                disabled={isSaving || !currentUser}
                type="submit"
              >
                {isSaving ? "Updating..." : "Update Details >"}
              </button>
            </div>
          </form>
        </section>
      )}

      {activeSection === "attended" && (
        <section className="rounded-[1.35rem] bg-white px-8 py-10 shadow-[6px_6px_0_var(--color-yellow-medium)] sm:px-12 lg:min-h-[31rem]">
          <h2 className="mb-9 mt-0 font-sans text-2xl font-bold text-blue-medium">
            Events I have attended
          </h2>

          <div className="font-alan-sans text-blue-medium">
            <h3 className="mb-4 mt-0 text-base font-bold">Upcoming:</h3>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <EventLabel icon={CalendarDays} name="Event Name Here" />
              <span className="flex items-center text-base font-semibold text-yellow-dark">
                view details
                <ChevronRight aria-hidden="true" className="ml-1 h-4 w-4" />
              </span>
            </div>

            <h3 className="mb-4 mt-10 text-xl font-bold">2026:</h3>
            <div className="grid gap-4">
              {attendedEvents.map((eventName, index) => (
                <div
                  className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  key={`${eventName}-${index}`}
                >
                  <EventLabel icon={Images} name={eventName} />
                  <span className="flex items-center text-base font-semibold text-yellow-dark">
                    view photos
                    <ChevronRight aria-hidden="true" className="ml-1 h-4 w-4" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button className="button" type="button">
              Load more
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

type EventLabelProps = {
  icon: typeof CalendarDays;
  name: string;
};

function EventLabel({ icon: Icon, name }: EventLabelProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-yellow-dark"
        strokeWidth={2.2}
      />
      <span className="truncate text-base font-semibold text-blue-medium">
        {name}
      </span>
      <span className="shrink-0 text-[0.7rem] font-semibold text-grey-medium">
        (DD/MM)
      </span>
    </div>
  );
}
