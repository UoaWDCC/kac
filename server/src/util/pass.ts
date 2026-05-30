import jwt from "jsonwebtoken";

const SECRET = process.env.PASS_JWT_SECRET!;

export interface PassPayload {
  googleUid: string;
  membershipYear: number;
}

export const signPassToken = (googleUid: string, membershipYear: number) => {
  const expiresAt = new Date(membershipYear, 11, 31, 23, 59, 59).getTime(); // Dec 31 of membership year
  const expiresInSeconds = Math.floor((expiresAt - Date.now()) / 1000);

  return jwt.sign({ googleUid, membershipYear }, SECRET, {
    expiresIn: expiresInSeconds,
  });
};

export const verifyPassToken = (token: string): PassPayload => {
  return jwt.verify(token, SECRET) as PassPayload;
};
