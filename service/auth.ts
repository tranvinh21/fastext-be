import crypto from "crypto-js";
import jwt, { type JwtPayload } from "jsonwebtoken";
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const secret = process.env.JWT_SECRET!;

export interface TokenPayload extends JwtPayload {
	userId: number;
}
const generateAccessToken = (userId: number) => {
	const payload: TokenPayload = { userId };
	// 15 minutes
	const options = { expiresIn: 15 * 60 * 1000 };
	return jwt.sign(payload, secret, options);
};

const generateRefreshToken = (userId: number) => {
	const payload: TokenPayload = { userId };
	// 7 days
	const options = { expiresIn: 30 * 24 * 60 * 60 * 1000 };
	return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string) => {
	return jwt.verify(token, secret) as JwtPayload;
};

const hashPassword = (password: string) => {
	return crypto.SHA256(password).toString(crypto.enc.Hex);
};

const verifyPassword = (password: string, hashedPassword: string) => {
	return hashPassword(password) === hashedPassword;
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
