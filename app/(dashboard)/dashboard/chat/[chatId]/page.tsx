import fetchRedis from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { messagesScheema, validateMessages } from "@/lib/validate";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface ChatProps {
  params: {
    chatId: string;
  };
}

const getChatMessages: (chatId: string) => Promise<void> = async (
  chatId: string,
) => {
  try {
    const res: string[] = await fetchRedis(
      `zrange`,
      `chat:${chatId}:messages`,
      0,
      -1,
    );

    const messages = res.map((mes: string) => {
      JSON.parse(mes) as Message;
    });

    const reversedMessages = messages.reverse();

    return messagesScheema.parse(reversedMessages);
  } catch {
    notFound();
  }
};

const Chat: ({ params }: ChatProps) => Promise<JSX.Element> = async ({
  params,
}: ChatProps): Promise<JSX.Element> => {
  const { chatId } = params;

  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  const { user } = session;
  const [userId1, userId2] = chatId.split("--");
  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chartPartner = (await fetchRedis(
    `get`,
    `user:${chatPartnerId}`,
  )) as User;

  const initialmessages = await getChatMessages(chatId);
  return <div>{params.chatId}</div>;
};

export default Chat;
