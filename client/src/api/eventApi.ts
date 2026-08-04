import api from "./index";

export async function getPastEventBySlug(slug: string) {
  const res = api.get(`/events/past/${encodeURIComponent(slug)}`);
  return res.then((response) => response.data);
}