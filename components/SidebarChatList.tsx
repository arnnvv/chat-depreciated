"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { Message, Messages } from "@/lib/validate";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import UnseenToast from "./UnseenToast";

interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
}

interface ExtendedMessageProps extends Message {
  senderImg: string;
  senderName: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({
  friends,
  sessionId,
}: SidebarChatListProps): JSX.Element => {
  const router: AppRouterInstance = useRouter();
  const pathname: string | null = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Messages>([]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:{sessionId}:friends`));

    const newFriendHandler = (): void => router.refresh();

    const chatHandler = (message: ExtendedMessageProps): void => {
      const shouldNotify: boolean =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      toast.custom((t) => (
        <UnseenToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderName={message.senderName}
          senderMessage={message.text}
        />
      ));

      setUnseenMessages((prev: Messages): Messages => [...prev, message]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [router, sessionId, pathname]);

  useEffect(() => {
    //checking everytime if user sees a Messages remove it from unseen
    if (pathname?.includes("chat")) {
      setUnseenMessages(
        (prev: Messages): Messages =>
          prev.filter(
            (msg: Message): boolean => !pathname?.includes(msg.senderId),
          ),
      );
    }
  }, [pathname]);
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend: User): JSX.Element => {
        const unseenMsgCount: number = unseenMessages.filter(
          (unseenMsg: Message): boolean => {
            return unseenMsg.senderId === friend.id;
          },
        ).length;
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id,
              )}`}
              className="text-gray-700 hover:text-cyan-400 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              {friend.name}
              {unseenMsgCount > 0 && (
                <div className="border-r-cyan-400 font-medium text-white text-xs w-4 h-4 rounded-full flex justify-center items-center">
                  {unseenMsgCount}
                </div>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
