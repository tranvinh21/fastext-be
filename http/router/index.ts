import { Router } from "express";
import AuthRouter from "./auth";
import FriendRouter from "./friend";
import UserRouter from "./user";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/friend", FriendRouter);
router.use("/user", UserRouter);

export default router;
