import api from "./index";

export type MembershipPrice = {
  amountCents: number;
  amount: number;
};

export async function getMembershipPrice(): Promise<MembershipPrice> {
  const res = await api.get("/membership-price");
  return res.data;
}

export async function updateMembershipPrice(
  amountCents: number
): Promise<MembershipPrice> {
  const res = await api.put("/membership-price", { amountCents });
  return res.data;
}
