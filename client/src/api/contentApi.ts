import api from "./index";

export async function getContent(id: string) {
  const res = api.get(`/contents/${id}`);
  return res.then((response) => response.data);
}

export async function createContent(contentData: {
  _id: string;
  content: string;
}) {
  const res = api.post("/contents", contentData);
  return res.then((response) => response.data);
}

export async function updateContent(id: string, content: string) {
  const res = api.put(`/contents/${id}`, { content });
  return res.then((response) => response.data);
}

export async function deleteContent(id: string) {
  const res = api.delete(`/contents/${id}`);
  return res.then((response) => response.data);
}
