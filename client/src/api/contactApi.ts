import api from "./index";

export function sendContact(contactData: {
  name: string;
  email: string;
  message: string;
}) {
  const res = api.post("/contacts", contactData);
  return res.then((response) => response.data);
}

export async function fetchContacts() {
  const res = api.get("/contacts");
  return res.then((response) => response.data);
}
