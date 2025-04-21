import type { Request, Response } from "express";
import {
	acceptFriendship,
	addFriend,
	cancelFriendship,
	getFriendRequestById,
	getFriendRequests,
	getFriendRequestsSent,
	getFriends,
	getFriendship,
	getUserById,
	rejectFriendship,
} from "../lib/db/queries";

export const getFriendsHandler = async (req: Request, res: Response) => {
	try {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const { userId } = req.user!;
		const friends = await getFriends(userId);
		res.status(200).json(friends);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const addFriendHandler = async (req: Request, res: Response) => {
	try {
		const { friendId } = req.body;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const { userId } = req.user!;
		const existingFriendship = await getFriendship(userId, friendId);
		if (existingFriendship.length > 0) {
			return res.status(400).json({ message: "Friendship already exists" });
		}
		const userExists = await getUserById(friendId);
		if (userExists.length === 0) {
			return res.status(400).json({ message: "User not found" });
		}
		await addFriend(userId, friendId);
		return res.status(200).json({ message: "Friend added" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const cancelFriendRequestHandler = async (
	req: Request,
	res: Response,
) => {
	try {
		const { requestId } = req.params;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const { userId } = req.user!;
		if (!requestId) {
			return res.status(400).json({ message: "Request ID is required" });
		}

		const request = await getFriendRequestById(Number.parseInt(requestId));
		if (request.length === 0) {
			return res.status(400).json({ message: "Request not found" });
		}

		if (request[0]?.status !== "pending" || request[0]?.isCancelled) {
			return res.status(400).json({ message: "Request is not pending" });
		}

		await cancelFriendship(Number.parseInt(requestId), userId);
		return res.status(200).json({ message: "Friend request cancelled" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const acceptFriendRequestHandler = async (
	req: Request,
	res: Response,
) => {
	try {
		const { requestId } = req.params;

		if (!requestId) {
			res.status(400).json({ message: "Request ID is required" });
			return;
		}
		await acceptFriendship(Number.parseInt(requestId));
		res.status(200).json({ message: "Friend accepted" });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const rejectFriendRequestHandler = async (
	req: Request,
	res: Response,
) => {
	try {
		const { requestId } = req.params;

		if (!requestId) {
			res.status(400).json({ message: "Request ID is required" });
			return;
		}
		await rejectFriendship(Number.parseInt(requestId));
		res.status(200).json({ message: "Friend rejected" });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getFriendRequestsReceivedHandler = async (
	req: Request,
	res: Response,
) => {
	try {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const { userId } = req.user!;
		const requests = await getFriendRequests(userId);
		res.status(200).json(requests);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getFriendRequestsSentHandler = async (
	req: Request,
	res: Response,
) => {
	try {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const { userId } = req.user!;
		const requests = await getFriendRequestsSent(userId);
		res.status(200).json(requests);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};
