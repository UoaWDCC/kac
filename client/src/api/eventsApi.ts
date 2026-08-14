import api from "./index";

export interface Event {
  title: string;
  description: string;
  imageUrl: string;
  datetime: string;
  capacity?: number;
}
export interface CreatedEvent extends Event {
  _id: string;
}

export interface EventsByTime {
  upcoming: CreatedEvent[];
  past: CreatedEvent[];
}

export function getAllEvents(): Promise<EventsByTime> {
  const res = api.get("/events");
  return res.then((response) => response.data);
}

export const getEventById = async (id: string): Promise<Event | undefined> => {
  return api.get(`/events/${id}`).then((response) => response.data);
};

export const createEvent = async (event: Event): Promise<CreatedEvent> => {
  const res = await api.post("/events", event);
  return res.data;
};
