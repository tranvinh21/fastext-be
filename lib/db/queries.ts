import { and, eq, not, or } from "drizzle-orm";
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

export async function getFriends(
  userId: number,
): Promise<(Friend & { friend: User })[]> {
  const friends = await db
    .select({
      id: friendsTable.id,
      userId: friendsTable.userId,
      friendId: friendsTable.friendId,
      initiatorId: friendsTable.initiatorId,
      status: friendsTable.status,
      createdAt: friendsTable.createdAt,
      updatedAt: friendsTable.updatedAt,
      friend: {
        id: users.id,
        name: users.name,
        email: users.email,
        password: users.password,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
    })
    .from(friendsTable)
    .innerJoin(
      users,
      or(
        and(
          eq(friendsTable.userId, userId),
          eq(users.id, friendsTable.friendId),
        ),
        and(
          eq(friendsTable.friendId, userId),
          eq(users.id, friendsTable.userId),
        ),
      ),
    )
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

export async function getFriendship(userId: number, friendId: number) {
  const friendship = await db
    .select()
    .from(friendsTable)
    .where(
      and(
        eq(friendsTable.userId, userId),
        eq(friendsTable.friendId, friendId),
        not(eq(friendsTable.status, "pending")),
        not(eq(friendsTable.isCancelled, true)),
      ),
    );
  return friendship;
}

export async function addFriend(userId: number, friendId: number) {
  console.log(userId, friendId);
  await db.insert(friendsTable).values({
    userId,
    friendId,
    initiatorId: userId,
    status: "pending",
  });
  return;
}

export async function getFriendRequestById(requestId: number) {
  const friendship = await db
    .select()
    .from(friendsTable)
    .where(
      and(eq(friendsTable.id, requestId), eq(friendsTable.status, "pending")),
    );
  return friendship;
}
export async function acceptFriendship(requestId: number) {
  await db
    .update(friendsTable)
    .set({ status: "accepted" })
    .where(and(eq(friendsTable.id, requestId)));
  return;
}

export async function rejectFriendship(requestId: number) {
  await db.delete(friendsTable).where(and(eq(friendsTable.id, requestId)));
  return;
}

export async function getFriendRequests(userId: number) {
  const friends = await db
    .select({
      id: friendsTable.id,
      userId: friendsTable.userId,
      friendId: friendsTable.friendId,
      initiatorId: friendsTable.initiatorId,
      status: friendsTable.status,
      createdAt: friendsTable.createdAt,
      updatedAt: friendsTable.updatedAt,
      friend: {
        id: users.id,
        name: users.name,
        email: users.email,
        password: users.password,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
    })
    .from(friendsTable)
    .innerJoin(
      users,
      or(
        and(
          eq(friendsTable.userId, userId),
          eq(users.id, friendsTable.friendId),
        ),
        and(
          eq(friendsTable.friendId, userId),
          eq(users.id, friendsTable.userId),
        ),
      ),
    )
    .where(
      and(
        not(eq(friendsTable.initiatorId, userId)),
        or(
          and(
            eq(friendsTable.userId, userId),
            eq(friendsTable.status, "pending"),
          ),
          and(
            eq(friendsTable.friendId, userId),
            eq(friendsTable.status, "pending"),
          ),
        ),
        not(eq(friendsTable.isCancelled, true)),
      ),
    );

  return friends;
}

export async function getFriendRequestsSent(userId: number) {
  const friends = await db
    .select({
      id: friendsTable.id,
      userId: friendsTable.userId,
      friendId: friendsTable.friendId,
      initiatorId: friendsTable.initiatorId,
      status: friendsTable.status,
      createdAt: friendsTable.createdAt,
      updatedAt: friendsTable.updatedAt,
      friend: {
        id: users.id,
        name: users.name,
        email: users.email,
        password: users.password,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
    })
    .from(friendsTable)
    .innerJoin(
      users,
      or(
        and(
          eq(friendsTable.userId, userId),
          eq(users.id, friendsTable.friendId),
        ),
        and(
          eq(friendsTable.friendId, userId),
          eq(users.id, friendsTable.userId),
        ),
      ),
    )
    .where(
      and(
        eq(friendsTable.initiatorId, userId),
        or(
          and(
            eq(friendsTable.userId, userId),
            eq(friendsTable.status, "pending"),
          ),
          and(
            eq(friendsTable.friendId, userId),
            eq(friendsTable.status, "pending"),
          ),
        ),
        not(eq(friendsTable.isCancelled, true)),
      ),
    );

  return friends;
}

export async function cancelFriendship(requestId: number, userId: number) {
  console.log(requestId, userId);
  await db
    .update(friendsTable)
    .set({ isCancelled: true, cancelledAt: new Date(), cancelledBy: userId })
    .where(
      and(eq(friendsTable.id, requestId), eq(friendsTable.status, "pending")),
    );
}
