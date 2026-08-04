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

export async function updateContact(
  id: string,
  contactData: {
    name: string;
    email: string;
    message: string;
  }
) {
  const res = api.put(`/contacts/${id}`, contactData);
  return res.then((response) => response.data);
}

export async function deleteContact(id: string) {
  const res = api.delete(`/contacts/${id}`);
  return res.then((response) => response.data);
}
