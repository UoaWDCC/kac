import api from "./index";

export default function createExec(
  imageURL: string,
  displayName: string,
  execRole: string,
  roleGroup: string,
  description: string
) {
  const res = api.post("/executives/", {
    imageURL,
    displayName,
    execRole,
    roleGroup,
    description,
  });
  return res.then((response: { data: any }) => response.data);
}
