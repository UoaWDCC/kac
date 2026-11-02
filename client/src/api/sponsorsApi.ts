import api from "./index";

export function getSponsors() {
  const res = api.get("/sponsors");
  return res.then((response) => response.data);
}

export function createSponsor(sponsor: {
  name: string;
  description: string;
  category: "cbd" | "newmarket" | "other";
}) {
  const res = api.post("/sponsors", sponsor);
  return res.then((response) => response.data);
}

export function updateSponsor(
  id: string,
  sponsor: Partial<{
    name: string;
    description: string;
    category: "cbd" | "newmarket" | "other";
  }>
) {
  const res = api.put(`/sponsors/${id}`, sponsor);
  return res.then((response) => response.data);
}

export function deleteSponsor(id: string) {
  const res = api.delete(`/sponsors/${id}`);
  return res.then((response) => response.data);
}
