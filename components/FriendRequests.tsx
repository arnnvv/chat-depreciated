import { FC, useState } from "react";

interface FriendRequestsProps {
  IncommingFriendReqs: IncommingFriendReq[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incommingFriendReqs,
  sessionId,
}) => {
  const [incommingReqs, setIncommingReqs] =
    useState<IncommingFriendReq[]>(incommingFriendReqs);
  return <div></div>;
};

export default FriendRequests;
