import api from "./index";

export function createTicket(
  eventID: Object,
  paymentID: string,
  groupBuddy?: string,
  dietaryRequirements?: string
) {
  const res = api.post("/tickets/", {
    eventID,
    paymentID,
    groupBuddy: groupBuddy,
    dietaryRequirements: dietaryRequirements,
  });
  return res.then((response: { data: any }) => response.data);
}

export function getTicketsByUserId(userID?: string) {
  const res = api.get("/tickets/", {
    params: userID ? { userID } : undefined,
  });
  return res.then((response: { data: any }) => response.data);
}
