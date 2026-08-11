import api from "./index";

export default function createTicket(
  eventID: Object,
  paymentID: string,
  groupBuddy?: string,
  dietaryRequirements?: string
) {
  const res = api.post("/tickets/create-ticket", {
    eventID,
    paymentID,
    groupBuddy: groupBuddy,
    dietaryRequirements: dietaryRequirements,
  });
  return res.then((response: { data: any }) => response.data);
}
