import api from "./index";

export async function createExec({
  imageURL,
  displayName,
  execRole,
  roleGroup,
  ethnicity,
  degree,
  mbti,
  fact,
  sponsor,
  greenFlag,
  redFlag,
  emojis,
}: {
  imageURL: string;
  displayName: string;
  execRole: string;
  roleGroup: string;
  ethnicity: string;
  degree: string;
  mbti: string;
  fact: string;
  sponsor: string;
  greenFlag: string;
  redFlag: string;
  emojis: string;
}) {
  const res = api.post("/executives/", {
    imageURL,
    displayName,
    execRole,
    roleGroup,
    ethnicity,
    degree,
    mbti,
    fact,
    sponsor,
    greenFlag,
    redFlag,
    emojis,
  });
  return res.then((response) => response.data);
}

export async function editExec(
  id: string,
  {
    imageURL,
    displayName,
    execRole,
    roleGroup,
    ethnicity,
    degree,
    mbti,
    fact,
    sponsor,
    greenFlag,
    redFlag,
    emojis,
  }: {
    imageURL: string;
    displayName: string;
    execRole: string;
    roleGroup: string;
    ethnicity: string;
    degree: string;
    mbti: string;
    fact: string;
    sponsor: string;
    greenFlag: string;
    redFlag: string;
    emojis: string;
  }
) {
  const execData = {
    imageURL,
    displayName,
    execRole,
    roleGroup,
    ethnicity,
    degree,
    mbti,
    fact,
    sponsor,
    greenFlag,
    redFlag,
    emojis,
  };
  const res = api.put(`/executives/${id}`, execData);
  return res.then((response) => response.data);
}

export async function deleteExec(id: string) {
  const res = api.delete(`/executives/${id}`);
  return res.then((response) => response.data);
}
