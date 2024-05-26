"use client";
import { Check, UserPlus, X } from "lucide-react";
import { FC, useState } from "react";

interface FriendRequestsProps {
  incommingFriendReqs: IncommingFriendReq[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incommingFriendReqs,
  sessionId,
}) => {
  const [incommingReqs, setIncommingReqs] =
    useState<IncommingFriendReq[]>(incommingFriendReqs);
  return (
    <>
      {incommingReqs.length === 0 ? (
        <p className="text-sm  text-zinc-500">No friend requests</p>
      ) : (
        incommingReqs.map((req: IncommingFriendReq) => {
          <div key={req.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{req.senderEmail}</p>
            <button
              aria-label="accept friend"
              className="w-8 h-8 bg-cyan-600 hover:bg-cyan-500 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>
            <button
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>;
        })
      )}
    </>
  );
};

export default FriendRequests;
