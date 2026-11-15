import { MembershipPrice, MEMBERSHIP_PRICE_ID } from "../model/membershipPrice";

export const DEFAULT_MEMBERSHIP_AMOUNT_CENTS = 500;

export class MembershipPriceError extends Error {}

export function parseMembershipAmountCents(value: unknown): number {
  const amountCents =
    typeof value === "string" && value.trim() !== "" ? Number(value) : value;

  if (
    typeof amountCents !== "number" ||
    !Number.isSafeInteger(amountCents) ||
    amountCents <= 0
  ) {
    throw new MembershipPriceError(
      "Membership price must be a whole number of cents greater than zero."
    );
  }

  return amountCents;
}

export async function getMembershipAmountCents(): Promise<number> {
  const membershipPrice =
    await MembershipPrice.findById(MEMBERSHIP_PRICE_ID).lean();

  return membershipPrice?.amountCents ?? DEFAULT_MEMBERSHIP_AMOUNT_CENTS;
}
