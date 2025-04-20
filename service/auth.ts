import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
const secret = process.env.JWT_SECRET!;

export interface TokenPayload extends JwtPayload {
  userId: number;
}
const generateAccessToken = (userId: number) => {
  const payload: TokenPayload = { userId };
  const options = { expiresIn: 60 * 60 * 1000 };
  return jwt.sign(payload, secret, options);
};

const generateRefreshToken = (userId: number) => {
  const payload: TokenPayload = { userId };
  const options = { expiresIn: 7 * 24 * 60 * 60 * 1000 };
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

const verifyPassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateAccesstokenFromRefreshToken = (refreshToken: string) => {
  const payload = verifyToken(refreshToken);
  return generateAccessToken(payload.userId);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  hashPassword,
  verifyPassword,
  generateAccesstokenFromRefreshToken,
};
