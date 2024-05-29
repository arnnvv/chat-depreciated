"use client";

import { cn } from "@/lib/utils";
import { Messages, Message } from "@/lib/validate";
import { format } from "date-fns";
import Image from "next/image";
import { FC, MutableRefObject, useRef, useState } from "react";

interface MessagesCompProps {
  chatId: string;
  chatPartner: User;
  sessionImg: string | null | undefined;
  sessionId: string;
  initialMessages: Messages;
}

const MessagesComp: FC<MessagesCompProps> = ({
  chatId,
  chatPartner,
  sessionImg,
  sessionId,
  initialMessages,
}: MessagesCompProps): JSX.Element => {
  const scrollRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Messages>(initialMessages);

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollRef} />
      {messages.map((message: Message, index: number): JSX.Element => {
        const isCurrentUser: boolean = message.senderId === sessionId;

        const hasNxtMessage: boolean =
          messages[index - 1]?.senderId === messages[index]?.senderId;
        return (
          <div
            key={`${message.id}-${message.timestamp}`}
            className="chat-message"
          >
            <div
              className={cn("flex items-end", isCurrentUser && "justify-end")}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-md mx-2",
                  isCurrentUser ? "order-1 items-end" : "order-2 items-start",
                )}
              >
                <span
                  className={cn(
                    "px-4 py-2 rounded-lg inline-block",
                    isCurrentUser
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-200 text-gray-900",
                    isCurrentUser && !hasNxtMessage && "rounded-br-none",
                    !isCurrentUser && !hasNxtMessage && "rounded-bl-none",
                  )}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-50">
                    {format(message.timestamp, "HH:mm")}
                  </span>
                </span>
              </div>

              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNxtMessage,
                })}
              >
                <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImg as string) : chatPartner.image
                  }
                  alt="Profile picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesComp;
