import { Router } from "express";
import AuthRouter from "./auth";
import FriendRouter from "./friend";
import UserRouter from "./user";
import conversationRouter from "./conversation";
import messageRouter from "./message";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/friend", FriendRouter);
router.use("/user", UserRouter);
router.use("/conversation", conversationRouter);
router.use("/message", messageRouter);
export default router;
