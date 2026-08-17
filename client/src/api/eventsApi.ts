import api from "./index";

// Payload for creating new event, doesn't include imageUrl or _id
// imageUrl: server-derived lookup tag (see addEvent in eventController.ts)
// _id: doesn't exist until the event is saved
export interface Event {
  title: string;
  description: string;
  datetime: string;
  capacity?: number;
}

// Persisted event, as returned by the server
// Adds the two fields once object exists in database
export interface CreatedEvent extends Event {
  _id: string;
  imageUrl: string;
}

export interface EventsByTime {
  upcoming: CreatedEvent[];
  past: CreatedEvent[];
}

export function getAllEvents(): Promise<EventsByTime> {
  const res = api.get("/events");
  return res.then((response) => response.data);
}

export const getEventById = async (
  id: string
): Promise<CreatedEvent | undefined> => {
  return api.get(`/events/${id}`).then((response) => response.data);
};

export const createEvent = async (event: Event): Promise<CreatedEvent> => {
  const res = await api.post("/events", event);
  return res.data;
};
