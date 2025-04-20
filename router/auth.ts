import { type Response, Router } from "express";
import { createUser, getUserByEmail } from "../lib/db/queries";
import { users } from "../lib/db/schema";
import { hashPassword, verifyPassword } from "../lib/utils/auth";

const router = Router();

interface SignupRequest {
	email: string;
	name: string;
	password: string;
}
interface SignupResponse {
	message: string;
}

interface SigninRequest {
	email: string;
	password: string;
}

router.post("/signup", async (req, res): Promise<void> => {
	const { email, password, name } = req.body as SignupRequest;
	const emailExists = await getUserByEmail(email);

	if (emailExists.length > 0) {
		res.status(400).json({ message: "Email already exists" });
		return;
	}
	const hashedPassword = await hashPassword(password);
	await createUser(email, hashedPassword, name);
	res.status(201).json({ message: "User created successfully" });
	return;
});

router.post("/signin", async (req, res): Promise<void> => {
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

	res.status(200).json({ message: "User signed in successfully" });
	return;
});

export default router;
