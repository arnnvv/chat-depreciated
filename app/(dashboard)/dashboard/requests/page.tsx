import fetchRedis from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface RequestsProps {}

const Requests: FC<RequestsProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  const incommingSenderIds = (await fetchRedis(
    `smembers`,
    `user:${session.user.id}:incoming_friend_requests`,
  )) as string[];

  const senderEmails = await Promise.all(
    incommingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as User;
      return {
        senderId,
        senderEmail: sender.email,
      };
    }),
  );
  console.log(senderEmails);
  return <div>Requests</div>;
};

export default Requests;
