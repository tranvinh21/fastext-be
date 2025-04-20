import { Router } from "express";
import {
	acceptFriendship,
	addFriend,
	getFriendRequests,
	getFriends,
	getFriendship,
	getUserById,
	rejectFriendship,
} from "../lib/db/queries";

const router = Router();

router.get("/:userId", async (req, res) => {
	const { userId } = req.params;
	const friends = await getFriends(Number.parseInt(userId));
	res.status(200).json({ friends });
});

router.post("/add", async (req, res) => {
	const { userId, friendId } = req.body;
	const existingFriendship = await getFriendship(userId, friendId);
	if (existingFriendship.length > 0) {
		res.status(400).json({ message: "Friendship already exists" });
		return;
	}
	const userExists = await getUserById(friendId);
	if (userExists.length === 0) {
		res.status(400).json({ message: "User not found" });
		return;
	}
	await addFriend(userId, friendId);
	res.status(200).json({ message: "Friend added" });
});

router.post("/accept", async (req, res) => {
	const { userId, friendId } = req.body;
	await acceptFriendship(userId, friendId);
	res.status(200).json({ message: "Friend accepted" });
});

router.post("/reject", async (req, res) => {
	const { userId, friendId } = req.body;
	await rejectFriendship(userId, friendId);
	res.status(200).json({ message: "Friend rejected" });
});

router.get("/requests/:userId", async (req, res) => {
	const { userId } = req.params;
	const requests = await getFriendRequests(Number.parseInt(userId));
	res.status(200).json({ requests });
});

export default router;
