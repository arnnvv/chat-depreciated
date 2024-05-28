import ChatInput from "@/components/ChatInput";
import MessagesComp from "@/components/Messages";
import fetchRedis from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { Messages, Message } from "@/lib/validate";
import { Session, getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

interface ChatProps {
  params: {
    chatId: string;
  };
}

const getChatMessages: (chatId: string) => Promise<Messages> = async (
  chatId: string,
): Promise<Messages> => {
  try {
    const res: string[] = await fetchRedis(
      `zrange`,
      `chat:${chatId}:messages`,
      0,
      -1,
    );

    const messages: Messages = res.map((mes: string): Message => {
      return JSON.parse(mes) as Message;
    });

    const reversedMessages: Messages = messages.reverse();

    return reversedMessages;
  } catch {
    notFound();
  }
};

const Chat: ({ params }: ChatProps) => Promise<JSX.Element> = async ({
  params,
}: ChatProps): Promise<JSX.Element> => {
  const { chatId } = params;

  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  const { user } = session;
  const [userId1, userId2] = chatId.split("--");
  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId: string = user.id === userId1 ? userId2 : userId1;

  const chartPartner: string = (await fetchRedis(
    `get`,
    `user:${chatPartnerId}`,
  )) as string;

  const chatPartner = JSON.parse(chartPartner) as User;

  const initialMessages: Messages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>

            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <MessagesComp
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default Chat;
