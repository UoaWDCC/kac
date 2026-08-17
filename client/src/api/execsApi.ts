import api from "./index";

export async function createExec(
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
  return res.then((response) => response.data);
}

export async function editExec(
  id: string,
  imageURL: string,
  displayName: string,
  execRole: string,
  roleGroup: string,
  description: string
) {
  const execData = {
    imageURL,
    displayName,
    execRole,
    roleGroup,
    description,
  };
  const res = api.put(`/executives/${id}`, execData);
  return res.then((response) => response.data);
}
