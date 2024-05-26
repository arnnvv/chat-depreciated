"use server";

import fetchRedis from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ZodError, object, string } from "zod";

export interface AcceptRejectProps {
  id: string;
}

const accept = async (sender: AcceptRejectProps) => {
  try {
    if (
      !object({
        id: string(),
      }).safeParse(sender).success
    ) {
      throw new Error("Invalid Payload");
    }

    const { id } = sender;

    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const isAlreadyFriend = await fetchRedis(
      `sismember`,
      `user:${session.user.id}:friends`,
      id,
    );

    if (isAlreadyFriend) throw new Error("Already friends");

    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      id,
    );

    if (!hasFriendRequest) throw new Error("No friend request");
  } catch (e) {
    if (e instanceof ZodError) {
      throw new Error(`Invalid payload: ${e.issues[0].message}`);
    }
    throw new Error(`Something went wrong in action: ${e}`);
  }
};

export default accept;
