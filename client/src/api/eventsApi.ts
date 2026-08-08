import api from "./index";

export function getEvents() {
  const res = api.get("/events");
  return res.then((response) => response.data);
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  coverImgUrl: string;
  date: string;
  time: string;
  location: string;
  price: number;
  signUpStatus: "Waiting" | "Open" | "Closed";
  dateSignOpen: string;
}

export const getEventById = async (id: string): Promise<Event | undefined> => {
  return api.get(`/events/${id}`).then((response) => response.data);
};

// TODO: confirm current event interface mismatch with event schema in server
export interface TempEvent {
  title: string;
  description: string;
  imageUrl: string;
  datetime: string;
  capacity?: number;
}

export interface CreatedEvent extends TempEvent {
  _id: string;
}

export const createEvent = async (event: TempEvent): Promise<CreatedEvent> => {
  const res = await api.post("/events", event);
  return res.data;
};
