import crypto from "crypto-js";
import jwt, { type JwtPayload } from "jsonwebtoken";
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const accessSecret = process.env.ACCESS_TOKEN_SECRET!;
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;
export interface TokenPayload extends JwtPayload {
	userId: number;
}
const generateAccessToken = (userId: number) => {
	const payload: TokenPayload = { userId };
	// 15 minutes
	const options = { expiresIn: 15 * 60 * 1000 };
	return jwt.sign(payload, accessSecret, options);
};

const generateRefreshToken = (userId: number) => {
	const payload: TokenPayload = { userId };
	// 7 days
	const options = { expiresIn: 30 * 24 * 60 * 60 * 1000 };
	return jwt.sign(payload, refreshSecret, options);
};

const verifyAccessToken = (token: string): TokenPayload => {
	return jwt.verify(token, accessSecret) as TokenPayload;
};

const verifyRefreshToken = (token: string): TokenPayload => {
	return jwt.verify(token, refreshSecret) as TokenPayload;
};

const hashPassword = (password: string) => {
	return crypto.SHA256(password).toString(crypto.enc.Hex);
};

const verifyPassword = (password: string, hashedPassword: string) => {
	return hashPassword(password) === hashedPassword;
};

const generateAccesstokenFromRefreshToken = (refreshToken: string) => {
	const payload = verifyRefreshToken(refreshToken);
	return generateAccessToken(payload.userId);
};

export {
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
	hashPassword,
	verifyPassword,
	generateAccesstokenFromRefreshToken,
};
