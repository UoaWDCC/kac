const { test, mock, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

// Stub Stripe before loading the controllers. These tests never send payments.
const stripePath = require.resolve("stripe");
require(stripePath);
const originalStripe = require.cache[stripePath].exports;
const stripe = { paymentIntents: { create() {}, retrieve() {} } };
require.cache[stripePath].exports = class Stripe {
  constructor() {
    return stripe;
  }
};
const { createPaymentIntent } = require("../src/controllers/paymentController");
const { createTicket } = require("../src/controllers/ticketController");
require.cache[stripePath].exports = originalStripe;
const { Event } = require("../src/model/event");
const { User } = require("../src/model/user");
const { Ticket } = require("../src/model/ticket");
const { Payment } = require("../src/model/payment");
const {
  getEventTicketAmount,
  verifyEventTicketPayment,
} = require("../src/util/eventPayment");

afterEach(() => mock.restoreAll());

const eventId = "111111111111111111111111";
const userId = new mongoose.Types.ObjectId("222222222222222222222222");
const user = { _id: userId, googleUid: "member-1" };
const event = {
  _id: new mongoose.Types.ObjectId(eventId),
  price: 12.5,
  datetime: new Date(Date.now() + 86400000),
};
const intent = {
  id: "pi_event_test",
  client_secret: "pi_event_test_secret",
  status: "succeeded",
  amount: 1250,
  amount_received: 1250,
  currency: "nzd",
  metadata: { type: "event_ticket", eventId, googleUid: user.googleUid },
};
const query = (value) => ({
  session: async () => value,
  sort: async () => value,
  then: (resolve, reject) => Promise.resolve(value).then(resolve, reject),
});

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

function request(body) {
  return { body, user: { id: user.googleUid }, isAuthenticated: () => true };
}

function stubModels({
  price = event.price,
  existing = null,
  payment = {},
  confirmed = 0,
  capacity,
} = {}) {
  mock.method(User, "findOne", () => query(user));
  mock.method(Event, "findById", () => query({ ...event, price, capacity }));
  mock.method(Event, "updateOne", async () => ({ matchedCount: 1 }));
  mock.method(Ticket, "findOne", () => query(existing));
  mock.method(Ticket, "countDocuments", () => query(confirmed));
  mock.method(Ticket, "exists", () => query(null));
  mock.method(Payment, "findOne", () => query(payment));
  mock.method(mongoose.connection, "transaction", (work) => work({}));
  mock.method(stripe.paymentIntents, "retrieve", async () => intent);
}

test("NZD prices convert to cents; legacy and free events require no payment", () => {
  assert.equal(getEventTicketAmount(12.5), 1250);
  assert.equal(getEventTicketAmount(19.99), 1999);
  assert.equal(getEventTicketAmount(0.29), 29);
  assert.equal(getEventTicketAmount(undefined), 0);
  assert.equal(getEventTicketAmount(null), 0);
  assert.equal(getEventTicketAmount(0), 0);
  for (const invalid of [-1, 1.234, Infinity, NaN]) {
    assert.throws(() => getEventTicketAmount(invalid));
  }
});

test("payment verification rejects another event, member, amount, currency or incomplete payment", () => {
  verifyEventTicketPayment(intent, eventId, user.googleUid, 1250);
  const invalid = [
    { metadata: { ...intent.metadata, eventId: "other-event" } },
    { metadata: { ...intent.metadata, googleUid: "other-member" } },
    { metadata: { ...intent.metadata, type: "membership" } },
    { status: "requires_payment_method" },
    { amount: 500 },
    { amount_received: 0 },
    { currency: "usd" },
  ];
  for (const change of invalid) {
    assert.throws(() =>
      verifyEventTicketPayment(
        { ...intent, ...change },
        eventId,
        user.googleUid,
        1250
      )
    );
  }
});

test("event checkout uses the stored price and binds the intent to the event and member", async () => {
  stubModels({ payment: null });
  const create = mock.method(
    stripe.paymentIntents,
    "create",
    async () => intent
  );
  const save = mock.method(Payment, "findOneAndUpdate", async () => ({}));
  const res = response();
  await createPaymentIntent(
    request({ type: "event_ticket", eventId, amount: 1 }),
    res
  );
  assert.equal(res.statusCode, 201);
  const [params, options] = create.mock.calls[0].arguments;
  assert.equal(params.amount, 1250);
  assert.deepEqual(params.metadata, intent.metadata);
  assert.ok(options.idempotencyKey);
  assert.equal(save.mock.calls[0].arguments[1].$setOnInsert.eventId, eventId);
});

test("checkout reuses a successful unclaimed payment after a refresh", async () => {
  stubModels({ payment: { stripePaymentIntentId: intent.id } });
  const create = mock.method(stripe.paymentIntents, "create", async () => {
    throw new Error("must not charge again");
  });
  mock.method(Payment, "findOneAndUpdate", async () => ({}));
  const res = response();
  await createPaymentIntent(request({ type: "event_ticket", eventId }), res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.status, "succeeded");
  assert.equal(res.body.paymentIntentId, intent.id);
  assert.equal(create.mock.calls.length, 0);
});

test("membership checkout still charges $5 and does not require an event", async () => {
  const create = mock.method(
    stripe.paymentIntents,
    "create",
    async () => intent
  );
  mock.method(Payment, "findOneAndUpdate", async () => ({}));
  const res = response();
  await createPaymentIntent(request({ type: "membership" }), res);
  assert.equal(res.statusCode, 201);
  assert.equal(create.mock.calls[0].arguments[0].amount, 500);
  assert.deepEqual(create.mock.calls[0].arguments[0].metadata, {
    type: "membership",
    googleUid: user.googleUid,
  });
});

test("paid registrations cannot bypass checkout using N/A", async () => {
  stubModels();
  const save = mock.method(Ticket.prototype, "save", async () => {
    throw new Error("must not save");
  });
  const res = response();
  await createTicket(request({ eventID: eventId, paymentID: "N/A" }), res);
  assert.equal(res.statusCode, 402);
  assert.equal(save.mock.calls.length, 0);
});

test("a verified payment is claimed in the same transaction as its registration", async () => {
  stubModels();
  mock.method(Ticket.prototype, "save", async function () {
    return this;
  });
  const claim = mock.method(Payment, "findOneAndUpdate", async () => ({}));
  const res = response();
  await createTicket(request({ eventID: eventId, paymentID: intent.id }), res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.paymentID, intent.id);
  assert.equal(res.body.status, "confirmed");
  const [filter, update, options] = claim.mock.calls[0].arguments;
  assert.equal(filter.ticketId, null);
  assert.equal(update.$set.ticketId.toString(), res.body._id.toString());
  assert.equal(update.$set.status, "succeeded");
  assert.ok(options.session);
});

test("replayed or missing payment records cannot create registrations", async () => {
  stubModels({ payment: null });
  const res = response();
  await createTicket(request({ eventID: eventId, paymentID: intent.id }), res);
  assert.equal(res.statusCode, 409);
});

test("retrying a saved registration returns that registration without claiming payment twice", async () => {
  const existing = { status: "confirmed", paymentID: intent.id };
  stubModels({ existing });
  const claim = mock.method(Payment, "findOneAndUpdate", async () => {
    throw new Error("must not claim twice");
  });
  const res = response();
  await createTicket(request({ eventID: eventId, paymentID: intent.id }), res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body, existing);
  assert.equal(claim.mock.calls.length, 0);
});

test("free registrations keep working without Stripe or a payment record", async () => {
  stubModels({ price: 0 });
  const retrieve = mock.method(stripe.paymentIntents, "retrieve", async () => {
    throw new Error("no card needed");
  });
  mock.method(Ticket.prototype, "save", async function () {
    return this;
  });
  const res = response();
  await createTicket(request({ eventID: eventId }), res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.paymentID, "N/A");
  assert.equal(retrieve.mock.calls.length, 0);
});

test("capacity still places additional registrations on the waitlist", async () => {
  stubModels({ price: 0, capacity: 1, confirmed: 1 });
  mock.method(Ticket.prototype, "save", async function () {
    return this;
  });
  const res = response();
  await createTicket(request({ eventID: eventId }), res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.status, "waitlisted");
});
