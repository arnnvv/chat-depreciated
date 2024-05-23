"use server";

import { authOptions } from "@/lib/auth";
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
      return new Response("Invalid email", { status: 422 });
    }

    console.log("Not FUCKED");
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const res = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${email}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
      },
    );
    const data = await res.json();
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
