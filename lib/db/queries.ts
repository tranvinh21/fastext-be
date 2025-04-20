import { and, eq, or } from "drizzle-orm";
import db from ".";
import {
	type Friend,
	type User,
	friends as friendsTable,
	users,
} from "./schema";

export async function createUser(
	email: string,
	password: string,
	name: string,
) {
	const user = await db.insert(users).values({ email, password, name });
	return user;
}

export async function getUserByEmail(email: string): Promise<User[]> {
	const user = await db.select().from(users).where(eq(users.email, email));
	return user;
}

export async function getUserByName(name: string): Promise<User[]> {
	const user = await db.select().from(users).where(eq(users.name, name));
	return user;
}

export async function getUserById(id: number): Promise<User[]> {
	const user = await db.select().from(users).where(eq(users.id, id));
	return user;
}

export async function getFriends(userId: number): Promise<Friend[]> {
	const friends = await db
		.select()
		.from(friendsTable)
		.where(
			or(
				and(
					eq(friendsTable.userId, userId),
					eq(friendsTable.status, "accepted"),
				),
				and(
					eq(friendsTable.friendId, userId),
					eq(friendsTable.status, "accepted"),
				),
			),
		);
	return friends;
}

export async function addFriend(userId: number, friendId: number) {
	await db.insert(friendsTable).values({
		userId,
		friendId,
		initiatorId: userId,
		status: "pending",
	});
	return;
}

export async function getFriendship(userId: number, friendId: number) {
	const friendship = await db
		.select()
		.from(friendsTable)
		.where(
			and(eq(friendsTable.userId, userId), eq(friendsTable.friendId, friendId)),
		);
	return friendship;
}

export async function acceptFriendship(userId: number, friendId: number) {
	await db
		.update(friendsTable)
		.set({ status: "accepted" })
		.where(
			and(eq(friendsTable.userId, userId), eq(friendsTable.friendId, friendId)),
		);
	return;
}

export async function rejectFriendship(userId: number, friendId: number) {
	await db
		.delete(friendsTable)
		.where(
			and(eq(friendsTable.userId, userId), eq(friendsTable.friendId, friendId)),
		);
	return;
}

export async function getFriendRequests(userId: number) {
	const requests = await db
		.select()
		.from(friendsTable)
		.where(
			and(
				eq(friendsTable.friendId, userId),
				eq(friendsTable.status, "pending"),
			),
		);
	return requests;
}
