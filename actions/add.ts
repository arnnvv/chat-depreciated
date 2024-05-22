"use server";

import { authOptions } from "@/lib/auth";
import { Email, emailSchema } from "@/lib/validate";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

const add = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
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
