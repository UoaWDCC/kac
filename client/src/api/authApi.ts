import api from "./index";

export function getCurrentUser() {
  const res = api.get("/auth/me");
  return res.then((res) => res.data);
}
