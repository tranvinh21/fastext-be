import type { Request, RequestHandler, Response } from "express";
import {
	createUser,
	getUserByEmail,
	getUserById,
	getUserByName,
} from "../../lib/db/queries";
import {
	generateAccessToken,
	generateRefreshToken,
	hashPassword,
	verifyPassword,
	verifyRefreshToken,
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
	const users = await getUserByEmail(email); // Fetch user by email

	const user = users.length > 0 ? users[0] : null;

	// Use the user's actual hash if they exist, otherwise use a default string
	// that is guaranteed not to match any real password hash.
	// This ensures the verifyPassword function is called in both cases,
	// helping to prevent timing attacks based on user existence.
	const hashToCompare = user
		? (user.password as string)
		: "dummy_invalid_hash_for_timing_attack_mitigation";

	// Perform password verification against the actual hash or the dummy hash.
	// This step takes roughly the same amount of time regardless of whether 'user' exists.
	const isPasswordValid = verifyPassword(password, hashToCompare);

	// Check if the user exists *and* the password is valid *after* the comparison.
	if (!user || !isPasswordValid) {
		// Return the same generic error message for both non-existent user
		// and incorrect password cases.
		res.status(400).json({ message: "invalid credentials" });
		return;
	}

	// Proceed with successful login only if user exists and password is valid
	const accessToken = generateAccessToken(user.id as unknown as number);
	console.log("accessToken", accessToken);
	const refreshToken = generateRefreshToken(user.id as unknown as number);
	res.cookie("accessToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 30 * 24 * 60 * 60 * 1000,
	});
	res.status(200).json({
		message: "User signed in successfully",
		accessToken,
	});
	// No explicit return needed here as res.json() sends the response
};

export const refreshTokenHandler: RequestHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const refreshToken = req.cookies?.accessToken;
		if (!refreshToken) {
			res.status(403).json({ message: "Forbidden" });
			return;
		}

		const payload = verifyRefreshToken(refreshToken);

		const userId = payload.userId;
		const user = await getUserById(userId);

		if (!user) {
			res.status(403).json({ message: "Forbidden" });
			return;
		}

		const newAccessToken = generateAccessToken(userId);
		res.status(200).json({
			message: "Access token refreshed successfully",
			accessToken: newAccessToken,
		});
	} catch (error) {
		// Handle potential errors from token verification (e.g., expired, invalid)
		console.error("Refresh token error:", error);
		if (error instanceof Error && error.name === "JsonWebTokenError") {
			res.status(401).json({ message: "Invalid refresh token" });
		} else if (error instanceof Error && error.name === "TokenExpiredError") {
			res.status(401).json({ message: "Refresh token expired" });
		} else {
			res
				.status(500)
				.json({ message: "An error occurred during token refresh" });
		}
	}
};

export const logoutHandler: RequestHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	res.clearCookie("accessToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
	});
	res.status(200).json({ message: "Logged out successfully" });
};
