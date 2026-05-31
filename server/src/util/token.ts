import jwt from "jsonwebtoken";

const SECRET = process.env.PASS_JWT_SECRET!;

export interface TokenPayload {
  googleUid: string;
  membershipYear: number;
}

export const signToken = (googleUid: string, membershipYear: number) => {
  const expiresAt = new Date(membershipYear, 11, 31, 23, 59, 59).getTime(); // Dec 31 of membership year
  const expiresInSeconds = Math.floor((expiresAt - Date.now()) / 1000);

  return jwt.sign({ googleUid, membershipYear }, SECRET, {
    expiresIn: expiresInSeconds,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, SECRET) as TokenPayload;
};
