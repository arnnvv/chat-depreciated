import { FC } from "react";

interface ChatInputProps {
  chatId: string;
  chatPartner: User | null;
}

const ChatInput: FC<ChatInputProps> = ({
  chatId,
  chatPartner,
}: ChatInputProps): JSX.Element => {
  return <div>ChatInput</div>;
};

export default ChatInput;
