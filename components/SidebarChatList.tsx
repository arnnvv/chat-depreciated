"use client";

import { chatHrefConstructor } from "@/lib/utils";
import { Message, Messages } from "@/lib/validate";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({
  friends,
  sessionId,
}: SidebarChatListProps): JSX.Element => {
  const router: AppRouterInstance = useRouter();
  const pathname: string | null = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Messages>([]);

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
