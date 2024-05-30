"use server";

import fetchRedis from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Email, validateEmail } from "@/lib/validate";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

const add = async (formData: Email) => {
  try {
    const email = formData.email;

    if (
      !validateEmail({
        email,
      })
    ) {
      console.log("F**KED");
      throw new Error("Invalid email");
    }

    console.log("Not FUCKED");
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("Unauthorized");
    }

    const idToAdd = await fetchRedis(`get`, `user:email:${email}`);

    if (!idToAdd) {
      throw new Error("User does not exist");
    }

    if (idToAdd === session.user.id) {
      throw new Error("Cannot add yourself");
    }

    const alreadyAdded = (await fetchRedis(
      `sismember`,
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id,
    )) as 0 | 1;

    if (alreadyAdded) {
      throw new Error("Already added this user");
    }

    const alreadyFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd,
    )) as 0 | 1;

    if (alreadyFriend) {
      throw new Error("Already friends with this user");
    }

    console.log("Trigger Pushed");
    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_request`),
      "incoming_friend_request",
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      },
    );

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    console.log("Done");
    return {
      message: "Request sent",
    };
  } catch (e) {
    if (e instanceof ZodError) {
      throw new Error(`Invalid payload type ${e?.message}`);
    }
    throw new Error(`Something went wrong in action ${e}`);
  }
};

export default add;
