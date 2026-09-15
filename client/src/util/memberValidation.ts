import { FACULTIES } from "../constants/faculties";

export const MEMBER_FIELD_LIMITS = {
  email: 254,
  firstName: 60,
  lastName: 60,
  latestMembershipYear: 4,
  memberSince: 40,
  mobileNumber: 20,
  pronouns: 40,
  studentId: 20,
  university: 120,
  upi: 32,
  yearOfStudy: 2,
} as const;

export type MemberField = keyof typeof MEMBER_FIELD_LIMITS;

type MemberInputProps = {
  inputMode?: "numeric" | "text";
  maxLength?: number;
  pattern?: string;
};

type MemberValidationOptions = {
  allowEmail?: boolean;
  allowLatestMembershipYear?: boolean;
  requireYearOfStudy?: boolean;
};

export type MemberValidationInput = {
  email?: string;
  faculties?: string[];
  firstName?: string;
  lastName?: string;
  latestMembershipYear?: string | number | null;
  mobileNumber?: string;
  pronouns?: string;
  studentId?: string;
  university?: string;
  upi?: string;
  yearOfStudy?: string | number;
};

export type NormalizedMemberProfile = {
  email: string;
  faculties: string[];
  firstName: string;
  lastName: string;
  latestMembershipYear: string;
  mobileNumber: string;
  pronouns: string;
  studentId: string;
  university: string;
  upi: string;
  yearOfStudy: string;
};

const DIGITS_ONLY = /^\d+$/;
const SAFE_TEXT = /^[A-Za-z0-9 ]+$/;
const SAFE_PRONOUNS = /^[A-Za-z0-9 /-]+$/;
const SAFE_ID = /^[A-Za-z0-9]+$/;
const SIMPLE_EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const NUMERIC_FIELDS = new Set<string>([
  "latestMembershipYear",
  "mobileNumber",
  "studentId",
  "yearOfStudy",
]);

const FIELD_LABELS: Record<string, string> = {
  email: "Email Address",
  firstName: "First Name",
  lastName: "Last Name",
  latestMembershipYear: "Membership Year",
  mobileNumber: "Phone Number",
  pronouns: "Pronouns",
  studentId: "Student Number",
  university: "University",
  upi: "Student Username / UPI",
  yearOfStudy: "Year of Study",
};

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "mobileNumber",
  "university",
  "studentId",
  "upi",
] as const;

const toStringValue = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

const collapseWhitespace = (value: string) => value.replace(/\s+/g, " ");

const limitValue = (field: string, value: string) => {
  const limit = MEMBER_FIELD_LIMITS[field as MemberField];
  return limit ? value.slice(0, limit) : value;
};

export const filterMemberFieldInput = (field: string, value: string) => {
  if (NUMERIC_FIELDS.has(field)) {
    return limitValue(field, value.replace(/\D/g, ""));
  }

  if (field === "upi") {
    return limitValue(field, value.replace(/[^A-Za-z0-9]/g, ""));
  }

  if (field === "pronouns") {
    return limitValue(
      field,
      collapseWhitespace(value.replace(/[^A-Za-z0-9 /-]/g, ""))
    );
  }

  if (field === "email" || field === "memberSince") {
    return limitValue(field, value);
  }

  return limitValue(
    field,
    collapseWhitespace(value.replace(/[^A-Za-z0-9 ]/g, ""))
  );
};

const normalizeTextField = (field: string, value: unknown) =>
  limitValue(field, collapseWhitespace(toStringValue(value).trim()));

export const getMemberInputProps = (field: string): MemberInputProps => ({
  inputMode: NUMERIC_FIELDS.has(field) ? "numeric" : "text",
  maxLength: MEMBER_FIELD_LIMITS[field as MemberField],
  pattern: NUMERIC_FIELDS.has(field) ? "[0-9]*" : undefined,
});

export const normalizeMemberProfile = (
  input: MemberValidationInput
): NormalizedMemberProfile => ({
  email: normalizeTextField("email", input.email),
  faculties: Array.isArray(input.faculties)
    ? [...new Set(input.faculties.map((faculty) => faculty.trim()))]
    : [],
  firstName: normalizeTextField("firstName", input.firstName),
  lastName: normalizeTextField("lastName", input.lastName),
  latestMembershipYear: normalizeTextField(
    "latestMembershipYear",
    input.latestMembershipYear
  ),
  mobileNumber: normalizeTextField("mobileNumber", input.mobileNumber),
  pronouns: normalizeTextField("pronouns", input.pronouns),
  studentId: normalizeTextField("studentId", input.studentId),
  university: normalizeTextField("university", input.university),
  upi: normalizeTextField("upi", input.upi),
  yearOfStudy: normalizeTextField("yearOfStudy", input.yearOfStudy),
});

export const getMemberValidationErrors = (
  input: MemberValidationInput,
  options: MemberValidationOptions = {}
) => {
  const normalized = normalizeMemberProfile(input);
  const errors: string[] = [];
  const isUoa = normalized.university === "The University of Auckland";
  const missingFields: string[] = REQUIRED_FIELDS.filter((field) => {
    if (!isUoa && (field === "studentId" || field === "upi")) {
      return false;
    }
    return !normalized[field];
  });

  if (options.requireYearOfStudy && !normalized.yearOfStudy) {
    missingFields.push("yearOfStudy");
  }

  if (missingFields.length > 0) {
    errors.push(
      `Please fill in: ${missingFields
        .map((field) => FIELD_LABELS[field])
        .join(", ")}.`
    );
  }

  if (normalized.mobileNumber && !DIGITS_ONLY.test(normalized.mobileNumber)) {
    errors.push("Phone Number can only contain numbers.");
  }

  if (normalized.studentId && !DIGITS_ONLY.test(normalized.studentId)) {
    errors.push("Student Number can only contain numbers.");
  }

  const safeTextFields = ["firstName", "lastName", "university"] as const;

  safeTextFields.forEach((field) => {
    const value = normalized[field];
    if (value && !SAFE_TEXT.test(value)) {
      errors.push(
        `${FIELD_LABELS[field]} can only contain letters, numbers, and spaces.`
      );
    }
  });

  if (normalized.upi && !SAFE_ID.test(normalized.upi)) {
    errors.push("Student Username / UPI can only contain letters and numbers.");
  }

  if (normalized.pronouns && !SAFE_PRONOUNS.test(normalized.pronouns)) {
    errors.push(
      "Pronouns can only contain letters, numbers, spaces, /, and -."
    );
  }

  if (options.requireYearOfStudy && normalized.yearOfStudy) {
    const year = Number(normalized.yearOfStudy);
    if (!DIGITS_ONLY.test(normalized.yearOfStudy) || year < 1 || year > 20) {
      errors.push("Year of Study must be a number between 1 and 20.");
    }
  }

  if (
    options.allowLatestMembershipYear &&
    normalized.latestMembershipYear &&
    (!DIGITS_ONLY.test(normalized.latestMembershipYear) ||
      Number(normalized.latestMembershipYear) < 2000 ||
      Number(normalized.latestMembershipYear) > 2100)
  ) {
    errors.push("Membership Year must be a valid year between 2000 and 2100.");
  }

  if (
    options.allowEmail &&
    normalized.email &&
    !SIMPLE_EMAIL.test(normalized.email)
  ) {
    errors.push("Email Address must be a valid email.");
  }

  const isNone = !normalized.university || normalized.university === "None";
  if (!isNone && normalized.faculties.length === 0) {
    errors.push("Select at least one faculty.");
  } else if (
    normalized.faculties.some((faculty) => !FACULTIES.includes(faculty))
  ) {
    errors.push("Select only valid faculties.");
  }

  return errors;
};
