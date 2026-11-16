const { test, mock, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const stripePath = require.resolve("stripe");
require(stripePath);
const originalStripe = require.cache[stripePath].exports;
require.cache[stripePath].exports = class Stripe {
  constructor() {
    return {};
  }
};
const {
  getCurrentDigitalCardLink,
} = require("../src/controllers/userController");
require.cache[stripePath].exports = originalStripe;

const { User } = require("../src/model/user");
const { Content } = require("../src/model/content");
const { getContent } = require("../src/controllers/contentController");
const { getMembershipYear } = require("../src/util/date");

afterEach(() => mock.restoreAll());

function response() {
  return {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function request({ authenticated = true, id = "member-1" } = {}) {
  return {
    user: { id },
    isAuthenticated: () => authenticated,
  };
}

test("digital card link is rejected for unauthenticated users", async () => {
  const res = response();
  await getCurrentDigitalCardLink(request({ authenticated: false }), res);

  assert.equal(res.statusCode, 401);
});

test("digital card link is rejected for members without current-year membership", async () => {
  mock.method(User, "findOne", async () => ({
    latestMembershipYear: getMembershipYear() - 1,
  }));
  const findContent = mock.method(Content, "findById", () => {
    throw new Error("The link must not be fetched for unpaid members");
  });
  const res = response();

  await getCurrentDigitalCardLink(request(), res);

  assert.equal(res.statusCode, 403);
  assert.equal(findContent.mock.calls.length, 0);
});

test("current members receive the saved digital card link", async () => {
  mock.method(User, "findOne", async () => ({
    latestMembershipYear: getMembershipYear(),
  }));
  mock.method(Content, "findById", () => ({
    lean: async () => ({ content: " https://example.com/card " }),
  }));
  const res = response();

  await getCurrentDigitalCardLink(request(), res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.link, "https://example.com/card");
});

test("current members get a clear response when no link is configured", async () => {
  mock.method(User, "findOne", async () => ({
    latestMembershipYear: getMembershipYear(),
  }));
  mock.method(Content, "findById", () => ({ lean: async () => null }));
  const res = response();

  await getCurrentDigitalCardLink(request(), res);

  assert.equal(res.statusCode, 404);
});

test("the card link cannot be read through the public content endpoint", async () => {
  const res = response();

  await getContent(
    {
      params: { id: "digital-card-link" },
      isAuthenticated: () => false,
    },
    res
  );

  assert.equal(res.statusCode, 403);
});

test("admins can read the card link content for editing", async () => {
  mock.method(User, "findOne", async () => ({ isAdmin: true }));
  mock.method(Content, "findById", () => ({
    lean: async () => ({
      _id: "digital-card-link",
      content: "https://example.com/card",
    }),
  }));
  const res = response();

  await getContent(
    {
      params: { id: "digital-card-link" },
      user: { id: "admin-1" },
      isAuthenticated: () => true,
    },
    res
  );

  assert.equal(res.body.content, "https://example.com/card");
});
