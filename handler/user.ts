import type { Request, Response } from "express";
import { getUserByName } from "../lib/db/queries";

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
