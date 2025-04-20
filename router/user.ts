import { Router } from "express";
import { getUserByEmail, getUserById, getUserByName } from "../lib/db/queries";

const router = Router();

router.get("/name/:name", async (req, res) => {
	const { name } = req.params;
	const user = await getUserByName(name);
	if (user.length === 0) {
		res.status(404).json({ message: "User not found" });
		return;
	}
	res.status(200).json({ user: user[0] });
});

router.get("/email/:email", async (req, res) => {
	const { email } = req.params;
	const user = await getUserByEmail(email);
	if (user.length === 0) {
		res.status(404).json({ message: "User not found" });
		return;
	}
	res.status(200).json({ user: user[0] });
});

router.get("/:userId", async (req, res) => {
	const { userId } = req.params;
	const user = await getUserById(Number.parseInt(userId));
	if (user.length === 0) {
		res.status(404).json({ message: "User not found" });
		return;
	}
	res.status(200).json({ user: user[0] });
});

export default router;
