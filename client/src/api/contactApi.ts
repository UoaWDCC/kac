export async function sendContact(contactData: {
  name: string;
  email: string;
  message: string;
}) {
  const res = await fetch("/api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message || "Failed to send contact");
  }

  return res.json();
}

export async function fetchContacts() {
  const res = await fetch("/api/contacts");

  if (!res.ok) {
    throw new Error("Failed to fetch contacts");
  }

  return res.json();
}
