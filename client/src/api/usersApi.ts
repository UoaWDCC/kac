import api from "./index";

export async function fetchMembers() {
  const response = await api.get("/users");
  return response.data;
}

export async function updateMember(id: string, member: object) {
  const response = await api.put(`/users/${id}`, member);
  return response.data;
}

export async function deleteMember(id: string) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}
