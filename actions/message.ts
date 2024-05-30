"use server";

import fetchRedis from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Message, validateMessage } from "@/lib/validate";
import { nanoid } from "nanoid";
import { Session, getServerSession } from "next-auth";
import { string } from "zod";

interface MessageActionProps {
  input: string;
  chatId: string;
}

const message: ({
  input,
  chatId,
}: MessageActionProps) => Promise<void> = async ({
  input,
  chatId,
}: MessageActionProps): Promise<void> => {
  try {
    if (!string().max(2000).safeParse(input).success)
      throw new Error("Message too long");

    const session: Session | null = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorised");

    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2)
      throw new Error("Unauthorised");

    const friendId: string = session.user.id === userId1 ? userId2 : userId1;

    const friends = (await fetchRedis(
      `smembers`,
      `user:${session.user.id}:friends`,
    )) as string[];

    if (!friends.includes(friendId)) throw new Error("Unauthorised");

    const sender = JSON.parse(
      await fetchRedis("get", `user:${session.user.id}`),
    ) as User;

    const receiver = JSON.parse(
      await fetchRedis("get", `user:${friendId}`),
    ) as User;

    const timestamp: number = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      receiverId: friendId,
      text: input,
      timestamp,
    };

    if (!validateMessage(messageData))
      throw new Error("Invalid message payload");

    pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming-message",
      messageData,
    );

    pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), "new_message", {
      ...messageData,
      senderImg: sender.image,
      senderName: sender.name,
    });

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(messageData),
    });
    console.log(
      `Sent message: ${input} from ${sender.email} to ${receiver.email}`,
    );
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message);
    throw new Error(`Failed to send message via Action: ${e}`);
  }
};

export default message;
