"use server";

import fetchRedis from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
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

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    console.log("Done");
    return {
      message: "Request sent",
    };
  } catch (e) {
    if (e instanceof ZodError) {
      return new Response(`Invalid payload type ${e?.message}`, {
        status: 422,
      });
    }
    return new Response(`Something went wrong in action ${e}`, {
      status: 500,
    });
  }
};

export default add;
