/**
 * Dev helper: delivers a signed Stripe `payment_intent.succeeded` webhook to the
 * local server, for when you don't have the Stripe CLI.
 *
 * Stripe cannot reach localhost, so after paying in the browser nothing updates.
 * This signs an event with STRIPE_WEBHOOK_SECRET from .env and posts it, which
 * is exactly what `stripe listen` would forward.
 *
 *   node fire-webhook.mjs                      # renew whoever is expired
 *   node fire-webhook.mjs you@email.com        # renew that account
 *   node fire-webhook.mjs you@email.com 2024   # EXPIRE that account (set the year back)
 *
 * The identifier can be an email or a googleUid.
 */
import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Resolve .env next to this file, so the script works from any directory.
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), ".env") });

for (const key of ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "MONGODB_USER", "MONGODB_PASSWORD"]) {
  if (!process.env[key]) {
    console.error(`Missing ${key} — expected it in server/.env`);
    process.exit(1);
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const [argWho, argYear] = process.argv.slice(2);

const u = encodeURIComponent(process.env.MONGODB_USER);
const p = encodeURIComponent(process.env.MONGODB_PASSWORD);
await mongoose.connect(
  `mongodb://${u}:${p}@ac-pcfgzmm-shard-00-00.cf1fyh5.mongodb.net:27017,` +
    "ac-pcfgzmm-shard-00-01.cf1fyh5.mongodb.net:27017," +
    "ac-pcfgzmm-shard-00-02.cf1fyh5.mongodb.net:27017/" +
    "?tls=true&replicaSet=atlas-b12118-shard-0&authSource=admin&appName=kac-prod"
);
const Users = mongoose.connection.db.collection("users");
const now = new Date();
const YEAR = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();

try {
  // Accept either an email or a googleUid.
  const find = (who) =>
    Users.findOne(who.includes("@") ? { email: who } : { googleUid: who });

  // Expire mode: set the year back so the account becomes "legacy" again.
  if (argWho && argYear) {
    const target = await find(argWho);
    if (!target) {
      console.log(`No account found for "${argWho}".`);
      process.exit(1);
    }
    await Users.updateOne(
      { _id: target._id },
      { $set: { latestMembershipYear: Number(argYear) } }
    );
    console.log(
      `${target.firstName} ${target.lastName}: ${target.latestMembershipYear} -> ${argYear}` +
        (Number(argYear) === YEAR ? "" : ' (role is now "legacy")')
    );
    process.exit(0);
  }

  let googleUid;
  if (argWho) {
    const target = await find(argWho);
    if (!target) {
      console.log(`No account found for "${argWho}".`);
      process.exit(1);
    }
    googleUid = target.googleUid;
  }
  if (!googleUid) {
    const expired = await Users.findOne({
      latestMembershipYear: { $ne: YEAR },
    });
    if (!expired) {
      console.log(`No expired members found — everyone is already ${YEAR}.`);
      process.exit(0);
    }
    googleUid = expired.googleUid;
    console.log(
      `targeting ${expired.firstName} ${expired.lastName} (year ${expired.latestMembershipYear})`
    );
  }

  const payload = JSON.stringify({
    id: "evt_local_" + Date.now(),
    object: "event",
    type: "payment_intent.succeeded",
    data: {
      object: {
        id: "pi_local_" + Date.now(),
        object: "payment_intent",
        metadata: { type: "membership", googleUid },
      },
    },
  });

  const res = await fetch("http://localhost:3000/api/payments/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": stripe.webhooks.generateTestHeaderString({
        payload,
        secret: process.env.STRIPE_WEBHOOK_SECRET,
      }),
    },
    body: payload,
  });

  const after = (await Users.findOne({ googleUid })).latestMembershipYear;
  console.log(`webhook -> HTTP ${res.status}`);
  console.log(
    after === YEAR
      ? `membership year is now ${after} — role should be "member" after a refresh`
      : `membership year is ${after}, expected ${YEAR} — check the server logs`
  );
} finally {
  await mongoose.disconnect();
}
