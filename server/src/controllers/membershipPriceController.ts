import { RequestHandler } from "express";
import { MembershipPrice, MEMBERSHIP_PRICE_ID } from "../model/membershipPrice";
import {
  getMembershipAmountCents,
  MembershipPriceError,
  parseMembershipAmountCents,
} from "../util/membershipPrice";

const toResponse = (amountCents: number) => ({
  amountCents,
  amount: amountCents / 100,
});

export const getMembershipPrice: RequestHandler = async (_req, res) => {
  try {
    const amountCents = await getMembershipAmountCents();
    res.json(toResponse(amountCents));
  } catch (error) {
    console.error("Error fetching membership price:", error);
    res.status(500).json({ message: "Failed to fetch membership price." });
  }
};

export const updateMembershipPrice: RequestHandler = async (req, res) => {
  try {
    const amountCents = parseMembershipAmountCents(req.body?.amountCents);

    const updated = await MembershipPrice.findByIdAndUpdate(
      MEMBERSHIP_PRICE_ID,
      { amountCents },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    res.json(toResponse(updated?.amountCents ?? amountCents));
  } catch (error) {
    if (error instanceof MembershipPriceError) {
      res.status(400).json({ message: error.message });
      return;
    }

    console.error("Error updating membership price:", error);
    res.status(500).json({ message: "Failed to update membership price." });
  }
};
