import api from "./index";

export function getEventById(id: string) {
  return api.get(`/events/${encodeURIComponent(id)}`).then((r) => r.data);
}
