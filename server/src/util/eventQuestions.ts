export class EventQuestionError extends Error {}

type Question = {
  id: string;
  label: string;
  enabled: boolean;
  required: boolean;
};

export function validateQuestionSettings(body: Record<string, unknown>) {
  for (const key of ["groupBuddyEnabled", "dietaryRequirementsEnabled"]) {
    if (key in body && typeof body[key] !== "boolean") {
      throw new EventQuestionError(`${key} must be a boolean.`);
    }
  }
  if (!("customQuestions" in body)) return;
  if (
    !Array.isArray(body.customQuestions) ||
    body.customQuestions.length > 30
  ) {
    throw new EventQuestionError("Provide at most 30 custom questions.");
  }
  const ids = new Set<string>();
  for (const question of body.customQuestions) {
    if (
      !question ||
      typeof question !== "object" ||
      typeof question.id !== "string" ||
      !question.id.trim() ||
      question.id.length > 100 ||
      ids.has(question.id) ||
      typeof question.label !== "string" ||
      !question.label.trim() ||
      question.label.trim().length > 300 ||
      typeof question.enabled !== "boolean" ||
      typeof question.required !== "boolean"
    ) {
      throw new EventQuestionError(
        "Each question needs a unique ID, question text (up to 300 characters), and valid toggles."
      );
    }
    ids.add(question.id);
  }
}

export function registrationAnswers(
  event: {
    groupBuddyEnabled?: boolean;
    dietaryRequirementsEnabled?: boolean;
    customQuestions?: Question[];
  },
  body: Record<string, unknown>
) {
  const readText = (value: unknown) => {
    if (value == null) return "";
    if (typeof value !== "string" || value.length > 2000) {
      throw new EventQuestionError(
        "Answers must be text of at most 2000 characters."
      );
    }
    return value.trim();
  };
  const groupBuddy =
    event.groupBuddyEnabled === false
      ? "N/A"
      : readText(body.groupBuddy) || "N/A";
  const dietaryRequirements =
    event.dietaryRequirementsEnabled === false
      ? "N/A"
      : readText(body.dietaryRequirements);
  if (!dietaryRequirements) {
    throw new EventQuestionError(
      "Please enter your dietary requirements, or N/A."
    );
  }
  const submitted = body.customAnswers ?? [];
  if (!Array.isArray(submitted) || submitted.length > 30) {
    throw new EventQuestionError("Invalid custom answers.");
  }
  const answers = new Map<string, unknown>();
  for (const item of submitted) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.questionId !== "string" ||
      answers.has(item.questionId)
    ) {
      throw new EventQuestionError("Invalid or duplicate question answer.");
    }
    answers.set(item.questionId, item.answer);
  }
  const customAnswers = (event.customQuestions ?? [])
    .filter((question) => question.enabled)
    .map((question) => {
      const answer = readText(answers.get(question.id));
      if (question.required && !answer) {
        throw new EventQuestionError(`Please answer: ${question.label}`);
      }
      return { questionId: question.id, label: question.label, answer };
    });
  return { groupBuddy, dietaryRequirements, customAnswers };
}
