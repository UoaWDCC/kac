const { test, mock, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const {
  registrationAnswers,
  validateQuestionSettings,
} = require("../src/util/eventQuestions");
const { Event } = require("../src/model/event");
const { Ticket } = require("../src/model/ticket");
const { updateEvent } = require("../src/controllers/eventController");

afterEach(() => mock.restoreAll());

const question = {
  id: "transport",
  label: "Do you need transport?",
  enabled: true,
  required: true,
};

test("one save updates event information and details together", async () => {
  const changes = {
    title: "Updated social",
    description: "Updated information",
    groupBuddyEnabled: false,
    dietaryRequirementsEnabled: true,
    customQuestions: [question],
  };
  const update = mock.method(Event, "findByIdAndUpdate", (_id, values) => ({
    lean: async () => ({ _id: "event-1", ...values }),
  }));
  const res = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  await updateEvent({ params: { id: "event-1" }, body: changes }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(update.mock.calls[0].arguments[1], changes);
  assert.deepEqual(res.body.customQuestions, [question]);
  assert.equal(res.body.title, changes.title);
});

test("legacy events keep both questions enabled and require dietary information", () => {
  const event = new Event({ title: "Social" });
  assert.equal(event.groupBuddyEnabled, true);
  assert.equal(event.dietaryRequirementsEnabled, true);
  assert.deepEqual(registrationAnswers({}, { dietaryRequirements: " N/A " }), {
    groupBuddy: "N/A",
    dietaryRequirements: "N/A",
    customAnswers: [],
  });
  assert.throws(() => registrationAnswers({}, {}), /dietary requirements/);
});

test("disabled standard and custom questions ignore stale answers", () => {
  const result = registrationAnswers(
    {
      groupBuddyEnabled: false,
      dietaryRequirementsEnabled: false,
      customQuestions: [{ ...question, enabled: false }],
    },
    {
      groupBuddy: "Stale buddy",
      dietaryRequirements: "Stale diet",
      customAnswers: [{ questionId: question.id, answer: "Stale answer" }],
    }
  );
  assert.deepEqual(result, {
    groupBuddy: "N/A",
    dietaryRequirements: "N/A",
    customAnswers: [],
  });
});

test("required custom questions reject blank answers and preserve server question text", () => {
  const event = {
    dietaryRequirementsEnabled: false,
    customQuestions: [question],
  };
  assert.throws(() => registrationAnswers(event, {}), /Please answer/);
  assert.throws(
    () =>
      registrationAnswers(event, {
        customAnswers: [{ questionId: question.id, answer: "  " }],
      }),
    /Please answer/
  );
  const result = registrationAnswers(event, {
    customAnswers: [
      { questionId: question.id, label: "Forged label", answer: " Yes " },
    ],
  });
  assert.deepEqual(result.customAnswers, [
    { questionId: question.id, label: question.label, answer: "Yes" },
  ]);
  const ticket = new Ticket(result);
  assert.equal(ticket.customAnswers[0].label, question.label);
  assert.equal(ticket.customAnswers[0].answer, "Yes");
});

test("optional answers can be empty, unknown answers are omitted, invalid answers are rejected", () => {
  const event = {
    dietaryRequirementsEnabled: false,
    customQuestions: [{ ...question, required: false }],
  };
  assert.equal(registrationAnswers(event, {}).customAnswers[0].answer, "");
  assert.equal(
    registrationAnswers(event, {
      customAnswers: [{ questionId: "unknown", answer: "ignored" }],
    }).customAnswers.length,
    1
  );
  for (const answer of [42, "x".repeat(2001)]) {
    assert.throws(
      () =>
        registrationAnswers(event, {
          customAnswers: [{ questionId: question.id, answer }],
        }),
      /Answers must be text/
    );
  }
  assert.throws(
    () =>
      registrationAnswers(event, {
        customAnswers: [{ questionId: "q" }, { questionId: "q" }],
      }),
    /duplicate/
  );
});

test("event settings reject malformed toggles, duplicate IDs and blank questions", () => {
  validateQuestionSettings({
    customQuestions: [question],
    groupBuddyEnabled: false,
  });
  validateQuestionSettings({ title: "Partial update" });
  for (const body of [
    { groupBuddyEnabled: "false" },
    { dietaryRequirementsEnabled: null },
    { customQuestions: null },
    { customQuestions: [question, question] },
    { customQuestions: [{ ...question, label: " " }] },
    { customQuestions: [{ ...question, label: "x".repeat(301) }] },
    { customQuestions: [{ ...question, enabled: "false" }] },
    {
      customQuestions: Array.from({ length: 31 }, (_, id) => ({
        ...question,
        id: String(id),
      })),
    },
  ])
    assert.throws(() => validateQuestionSettings(body));
});
