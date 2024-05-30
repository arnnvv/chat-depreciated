"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface FriendReqSidebarOption {
  sessioId: string;
  unsceenFriendReq: number;
}

const FriendReqSidebarOprion: FC<FriendReqSidebarOption> = ({
  sessioId,
  unsceenFriendReq,
}: FriendReqSidebarOption): JSX.Element => {
  const [unsceenREq, setUnsceenReq] = useState<number>(unsceenFriendReq);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessioId}:incoming_friend_request`),
    );

    const friendReqCountHandler = () => {
      setUnsceenReq((prev: number): number => prev + 1);
    };

    pusherClient.bind("incoming_friend_request", friendReqCountHandler);

    return () => {
      pusherClient.unsubscribe(`user:${sessioId}:incoming_friend_request`);
      pusherClient.unbind("incoming_friend_request", friendReqCountHandler);
    };
  }, [sessioId]);

  return (
    <Link
      href="/dashboard/requests"
      className="text-gray-700 hover:text-cyan-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
    >
      <div className="text-gray-400 border-gray-200 group-hover:border-cyan-600 group-hover:text-cyan-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
        <User className="w-4 h-4" />
      </div>
      <p className="truncate">Friend requests</p>

      {unsceenREq > 0 ? (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
          {unsceenREq}
        </div>
      ) : null}
    </Link>
  );
};

export default FriendReqSidebarOprion;
