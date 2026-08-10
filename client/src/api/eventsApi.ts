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
