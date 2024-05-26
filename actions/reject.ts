"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ZodError, object, string } from "zod";
import { AcceptRejectProps } from "./accept";

const reject = async (sender: AcceptRejectProps) => {
  try {
    if (
      !object({
        id: string(),
      }).safeParse(sender).success
    ) {
      throw new Error("Invalid Payload");
    }

    const { id } = sender;

    const sesssion = await getServerSession(authOptions);

    if (!sesssion) throw new Error("Unauthorized");
  } catch (e) {
    if (e instanceof ZodError) {
      throw new Error(`Inavalid Payload: ${e.issues[0].message}`);
    }
    throw new Error(`Something went wrong in action: ${e}`);
  }
};

export default reject;
