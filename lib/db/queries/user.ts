import { users as usersDB, type User } from "../schema";
import db from "../index";
import { inArray } from "drizzle-orm";

export const getUsersByIds = async (ids: number[]): Promise<User[]> => {
    const users = await db.select().from(usersDB).where(inArray(usersDB.id, ids));
    return users;
};
