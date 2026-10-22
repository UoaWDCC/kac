import api from "./index";

export interface TicketRecord {
  _id: string;
  userID: string | null;
  eventID: string;
  status: "confirmed" | "waitlisted" | "cancelled";
  registeredAt: string;
  waitlistedAt: string | null;
  attended: boolean;
  groupBuddy: string;
  dietaryRequirements: string;
}

export interface EventSignup extends TicketRecord {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  waitlistPosition?: number;
}

export async function createTicket(
  eventID: string,
  paymentID = "N/A",
  groupBuddy = "N/A",
  dietaryRequirements = "N/A"
): Promise<TicketRecord> {
  const response = await api.post<TicketRecord>("/tickets", {
    eventID,
    paymentID,
    groupBuddy,
    dietaryRequirements,
  });

  return response.data;
}

export default createTicket;

export async function getTicketsByEventID(
  eventId: string
): Promise<EventSignup[]> {
  const response = await api.get<EventSignup[]>(`/tickets/event/${eventId}`);

  return response.data;
}

export async function updateTicketAttendance(
  eventId: string,
  ticketId: string,
  attended: boolean
): Promise<void> {
  await api.patch(`/tickets/event/${eventId}/${ticketId}/attendance`, {
    attended,
  });
}

export async function cancelTicket(
  eventId: string,
  ticketId: string
): Promise<void> {
  await api.delete(`/tickets/event/${eventId}/${ticketId}`);
}

export async function promoteTicket(
  eventId: string,
  ticketId: string
): Promise<void> {
  await api.post(`/tickets/event/${eventId}/${ticketId}/promote`);
}

export async function getMyTicket(
  eventId: string
): Promise<TicketRecord | null> {
  const response = await api.get<TicketRecord | null>("/tickets/me", {
    params: { eventId },
  });

  return response.data;
}

export function getTicketsByUserId(userID?: string) {
  const res = api.get("/tickets/", {
    params: userID ? { userID } : undefined,
  });
  return res.then((response: { data: any }) => response.data);
}
