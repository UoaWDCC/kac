import api from "./index";

export async function getCurrentDigitalCardLink(): Promise<string> {
  const response = await api.get("/users/me/digital-card");
  return response.data.link;
}
