import { Messages } from "@/lib/validate";
import { FC } from "react";

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
  return <div>Messages</div>;
};

export default MessagesComp;
