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
      return new Response("Invalid email", {
        status: 422,
      });
    }

    console.log("Not FUCKED");
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const idToAdd = await fetchRedis(`get`, `user:email:${email}`);

    /*if (!idToAdd) {
      return new Response("User does not exist", {
        status: 401,
      });
    }

    if (idToAdd === session.user.id) {
      return new Response("Cannot add yourself", {
        status: 400,
      });
    }

    const alreadyAdded = (await fetchRedis(
      `sismember`,
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id,
    )) as 0 | 1;

    if (alreadyAdded) {
      return new Response("Already added this user", {
        status: 400,
      });
    }

    const alreadyFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd,
    )) as 0 | 1;

    if (alreadyFriend) {
      return new Response("Already friends with this user", {
        status: 400,
      });
    }

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    
    return new Response("OK", {
      status: 200,
    });*/
    console.log("Done");
    return;
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
