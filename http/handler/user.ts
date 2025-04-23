import type { Request, Response } from "express";
import { getUserById, getUserByName } from "../../lib/db/queries";
import type { TokenPayload } from "../service/auth";

export const getUserByNameHandler = async (req: Request, res: Response) => {
	const { name } = req.params;
	if (!name) {
		res.status(400).json({ message: "name is required" });
		return;
	}
	const user = await getUserByName(name);
	res.status(200).json({ users: user });
};

export const getUserByEmailHandler = async (req: Request, res: Response) => {
	const { email } = req.params;
	if (!email) {
		res.status(400).json({ message: "email is required" });
		return;
	}
};

export const getUserByIdHandler = async (req: Request, res: Response) => {
	const { userId } = req.params;
	if (!userId) {
		res.status(400).json({ message: "userId is required" });
		return;
	}
};

export const getUserProfileHandler = async (req: Request, res: Response) => {
	const user = req.user as TokenPayload;
	const userProfile = await getUserById(user.userId);
	if (!userProfile) {
		res.status(404).json({ message: "User not found" });
		return;
	}

	res.status(200).json({
		user: { ...userProfile[0], password: undefined },
	});
};
