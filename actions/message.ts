"use server";

interface MessageActionProps {
  input: string;
  chatId: string;
}

const message: ({
  input,
  chatId,
}: MessageActionProps) => Promise<void> = async ({
  input,
  chatId,
}: MessageActionProps): Promise<void> => {
  console.log(`Message :${input} in chat ${chatId}`);
};

export default message;
