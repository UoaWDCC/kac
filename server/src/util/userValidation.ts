export const FACULTIES = [
  "Arts",
  "Business School",
  "Creative Arts and Industries",
  "Education and Social Work",
  "Engineering",
  "Law",
  "Medical and Health Sciences",
  "Science",
];

type UserValidationOptions = {
  allowEmail?: boolean;
  allowLatestMembershipYear?: boolean;
  allowYearOfStudy?: boolean;
  requireAll?: boolean;
  requireYearOfStudy?: boolean;
};

type ValidatedUserFields = Partial<{
  email: string;
  faculties: string[];
  firstName: string;
  lastName: string;
  latestMembershipYear: number | null;
  mobileNumber: string;
  pronouns: string;
  studentId: string;
  university: string;
  upi: string;
  yearOfStudy: number;
}>;

type ValidationRule = {
  label: string;
  maxLength: number;
  pattern: RegExp;
  patternMessage: string;
  required?: boolean;
};

const DIGITS_ONLY = /^\d+$/;
const SAFE_TEXT = /^[A-Za-z0-9 ]+$/;
const SAFE_PRONOUNS = /^[A-Za-z0-9 /-]+$/;
const SAFE_ID = /^[A-Za-z0-9]+$/;
const SIMPLE_EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

const STRING_RULES = {
  firstName: {
    label: "First Name",
    maxLength: 60,
    pattern: SAFE_TEXT,
    patternMessage: "First Name can only contain letters, numbers, and spaces.",
    required: true,
  },
  lastName: {
    label: "Last Name",
    maxLength: 60,
    pattern: SAFE_TEXT,
    patternMessage: "Last Name can only contain letters, numbers, and spaces.",
    required: true,
  },
  mobileNumber: {
    label: "Phone Number",
    maxLength: 20,
    pattern: DIGITS_ONLY,
    patternMessage: "Phone Number can only contain numbers.",
    required: true,
  },
  pronouns: {
    label: "Pronouns",
    maxLength: 40,
    pattern: SAFE_PRONOUNS,
    patternMessage:
      "Pronouns can only contain letters, numbers, spaces, /, and -.",
  },
  studentId: {
    label: "Student Number",
    maxLength: 20,
    pattern: DIGITS_ONLY,
    patternMessage: "Student Number can only contain numbers.",
    required: true,
  },
  university: {
    label: "University",
    maxLength: 120,
    pattern: SAFE_TEXT,
    patternMessage: "University can only contain letters, numbers, and spaces.",
    required: true,
  },
  upi: {
    label: "Student Username / UPI",
    maxLength: 32,
    pattern: SAFE_ID,
    patternMessage:
      "Student Username / UPI can only contain letters and numbers.",
    required: true,
  },
} satisfies Record<string, ValidationRule>;

type StringUserField = keyof typeof STRING_RULES;

const hasOwn = (input: Record<string, unknown>, field: string) =>
  Object.prototype.hasOwnProperty.call(input, field);

const normalizeWhitespace = (value: string) =>
  value.trim().replace(/\s+/g, " ");

const getString = (
  input: Record<string, unknown>,
  field: StringUserField,
  errors: string[]
) => {
  const value = input[field];

  if (typeof value !== "string") {
    errors.push(`${STRING_RULES[field].label} must be text.`);
    return null;
  }

  return normalizeWhitespace(value);
};

const validateStringField = (
  input: Record<string, unknown>,
  field: StringUserField,
  values: ValidatedUserFields,
  errors: string[],
  requireAll: boolean
) => {
  const rule = STRING_RULES[field];
  const isRequired = "required" in rule && rule.required === true;

  if (!hasOwn(input, field)) {
    if (requireAll && isRequired) {
      errors.push(`${rule.label} is required.`);
    }

    return;
  }

  const value = getString(input, field, errors);

  if (value === null) {
    return;
  }

  if (!value) {
    if (isRequired || requireAll) {
      errors.push(`${rule.label} is required.`);
    }

    values[field] = value;
    return;
  }

  if (value.length > rule.maxLength) {
    errors.push(`${rule.label} must be ${rule.maxLength} characters or fewer.`);
  }

  if (!rule.pattern.test(value)) {
    errors.push(rule.patternMessage);
  }

  values[field] = value;
};

const validateFaculties = (
  input: Record<string, unknown>,
  values: ValidatedUserFields,
  errors: string[],
  requireAll: boolean
) => {
  if (!hasOwn(input, "faculties")) {
    if (requireAll) {
      errors.push("Select at least one faculty.");
    }

    return;
  }

  const faculties = input.faculties;

  if (!Array.isArray(faculties)) {
    errors.push("Faculties must be an array.");
    return;
  }

  const normalizedFaculties = [
    ...new Set(
      faculties
        .filter((faculty): faculty is string => typeof faculty === "string")
        .map((faculty) => faculty.trim())
    ),
  ];

  if (
    normalizedFaculties.length !== faculties.length ||
    normalizedFaculties.some((faculty) => !FACULTIES.includes(faculty))
  ) {
    errors.push("Select only valid faculties.");
    return;
  }

  if (normalizedFaculties.length === 0) {
    errors.push("Select at least one faculty.");
    return;
  }

  values.faculties = normalizedFaculties;
};

const validateYear = (
  input: Record<string, unknown>,
  field: "latestMembershipYear" | "yearOfStudy",
  label: string,
  values: ValidatedUserFields,
  errors: string[],
  options: { max: number; min: number; nullable?: boolean; required?: boolean }
) => {
  if (!hasOwn(input, field)) {
    if (options.required) {
      errors.push(`${label} is required.`);
    }

    return;
  }

  const rawValue = input[field];

  if ((rawValue === "" || rawValue === null) && options.nullable) {
    values.latestMembershipYear = null;
    return;
  }

  const value =
    typeof rawValue === "number" || typeof rawValue === "string"
      ? String(rawValue).trim()
      : "";

  if (!value) {
    errors.push(`${label} is required.`);
    return;
  }

  const numericValue = Number(value);

  if (
    !DIGITS_ONLY.test(value) ||
    !Number.isInteger(numericValue) ||
    numericValue < options.min ||
    numericValue > options.max
  ) {
    errors.push(
      `${label} must be a number between ${options.min} and ${options.max}.`
    );
    return;
  }

  if (field === "latestMembershipYear") {
    values.latestMembershipYear = numericValue;
  } else {
    values.yearOfStudy = numericValue;
  }
};

export const validateUserInput = (
  input: Record<string, unknown>,
  options: UserValidationOptions = {}
) => {
  const errors: string[] = [];
  const values: ValidatedUserFields = {};
  const requireAll = options.requireAll === true;

  (Object.keys(STRING_RULES) as StringUserField[]).forEach((field) => {
    validateStringField(input, field, values, errors, requireAll);
  });

  validateFaculties(input, values, errors, requireAll);

  if (options.allowYearOfStudy || options.requireYearOfStudy) {
    validateYear(input, "yearOfStudy", "Year of Study", values, errors, {
      max: 20,
      min: 1,
      required: options.requireYearOfStudy,
    });
  }

  if (options.allowLatestMembershipYear) {
    validateYear(
      input,
      "latestMembershipYear",
      "Membership Year",
      values,
      errors,
      {
        max: 2100,
        min: 2000,
        nullable: true,
      }
    );
  }

  if (options.allowEmail && hasOwn(input, "email")) {
    const email = input.email;

    if (typeof email !== "string") {
      errors.push("Email Address must be text.");
    } else {
      const normalizedEmail = email.trim().toLowerCase();

      if (!SIMPLE_EMAIL.test(normalizedEmail) || normalizedEmail.length > 254) {
        errors.push("Email Address must be a valid email.");
      } else {
        values.email = normalizedEmail;
      }
    }
  }

  return { errors, values };
};
