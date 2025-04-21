import type { Request, RequestHandler, Response } from "express";
import { createUser, getUserByEmail, getUserByName } from "../lib/db/queries";
import {
	generateAccessToken,
	generateAccesstokenFromRefreshToken,
	generateRefreshToken,
	hashPassword,
	verifyPassword,
} from "../service/auth";
interface SignupRequest {
	email: string;
	name: string;
	password: string;
}

export const signupHandler: RequestHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { email, password, name } = req.body as SignupRequest;

		// Check if email exists
		const emailExists = await getUserByEmail(email);
		if (emailExists.length > 0) {
			res.status(400).json({ message: "Email already exists" });
			return;
		}

		// Check if username exists
		const usernameExists = await getUserByName(name);
		if (usernameExists.length > 0) {
			res.status(400).json({ message: "Username already exists" });
			return;
		}

		// Hash password and create user
		const hashedPassword = await hashPassword(password);
		await createUser(email, hashedPassword, name);

		res.status(201).json({
			message: "User created successfully",
			data: {
				email,
				name,
			},
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ message: "An error occurred during signup" });
	}
};

interface SigninRequest {
	email: string;
	password: string;
}
export const signinHandler: RequestHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { email, password } = req.body as SigninRequest;
	const user = await getUserByEmail(email);
	if (user.length === 0) {
		res.status(400).json({ message: "User not found" });
		return;
	}
	const isPasswordValid = await verifyPassword(
		password,
		user[0]?.password as string,
	);
	if (!isPasswordValid) {
		res.status(400).json({ message: "Invalid password" });
		return;
	}
	const accessToken = generateAccessToken(user[0]?.id as unknown as number);
	const refreshToken = generateRefreshToken(user[0]?.id as unknown as number);

	res.status(200).json({
		message: "User signed in successfully",
		accessToken,
		refreshToken,
	});
	return;
};

export const refreshTokenHandler: RequestHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { refreshToken } = req.body as { refreshToken: string };
	const accessToken = generateAccesstokenFromRefreshToken(refreshToken);
	res.status(200).json({ accessToken });
	return;
};
