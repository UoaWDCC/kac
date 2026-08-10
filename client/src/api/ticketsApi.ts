import api from "./index";

export default function createTicket(
  userID: string,
  eventID: string,
  paymentID: string,
  groupBuddy?: string,
  dietaryRequirements?: string
) {
  const res = api.post("/tickets/create-ticket", {
    userID,
    eventID,
    paymentID,
    groupBuddy: groupBuddy,
    dietaryRequirements: dietaryRequirements,
  });
  return res.then((response: { data: any }) => response.data);
}
