"use client";
import { Check, UserPlus, X } from "lucide-react";
import { FC, useState } from "react";
import accept from "@/actions/accept";
import reject from "@/actions/reject";
import { useRouter } from "next/navigation";

interface FriendRequestsProps {
  incommingFriendReqs: IncommingFriendReq[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incommingFriendReqs,
  sessionId,
}) => {
  const router = useRouter();

  const [incommingReqs, setIncommingReqs] =
    useState<IncommingFriendReq[]>(incommingFriendReqs);

  const acceptReq = async (senderId: string) => {
    await accept({
      id: senderId,
    });

    setIncommingReqs((prev: IncommingFriendReq[]): IncommingFriendReq[] =>
      prev.filter((req: IncommingFriendReq) => req.senderId !== senderId),
    );

    router.refresh();
  };

  const rejectReq = async (senderId: string) => {
    await reject({
      id: senderId,
    });

    setIncommingReqs((prev: IncommingFriendReq[]): IncommingFriendReq[] =>
      prev.filter((req: IncommingFriendReq) => req.senderId !== senderId),
    );

    router.refresh();
  };

  return (
    <>
      {incommingReqs.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        incommingReqs.map((req: IncommingFriendReq) => (
          <div key={req.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{req.senderEmail}</p>
            <button
              onClick={() => acceptReq(req.senderId)}
              aria-label="accept friend"
              className="w-8 h-8 bg-cyan-500 hover:bg-cyan-500 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>

            <button
              onClick={() => rejectReq(req.senderId)}
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
