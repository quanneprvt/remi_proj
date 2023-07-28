import jwt, { SignOptions, JsonWebTokenError } from "jsonwebtoken";
import config from "config";

export const signJwt = (
  payload: Object,
  key: string,
  options: SignOptions = {}
) => {
  return jwt.sign(payload, key, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = <T>(token: string, key: string): T | null => {
  try {
    return jwt.verify(token, key) as T;
  } catch (error) {
    if ((error as JsonWebTokenError).name === "TokenExpiredError") {
      return null;
    }
    return null;
  }
};
