"use client";

import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  LegacyRef,
  MutableRefObject,
  useRef,
  useState,
} from "react";
import Button from "./ui/Button";
import ReactTextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import message from "@/actions/message";

interface ChatInputProps {
  chatId: string;
  chatPartner: User;
}

const ChatInput: FC<ChatInputProps> = ({
  chatId,
  chatPartner,
}: ChatInputProps): JSX.Element => {
  const textareaRef: MutableRefObject<HTMLAreaElement | null> =
    useRef<HTMLAreaElement | null>(null);

  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage: () => Promise<void> = async (): Promise<void> => {
    try {
      if (!input) return;
      setIsLoading(true);

      await message({
        input,
        chatId,
      });
      setInput("");
      textareaRef.current?.focus();
    } catch (e) {
      toast.error(`Error While Sending Message: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-cyan-400">
        <ReactTextareaAutosize
          ref={textareaRef as LegacyRef<HTMLTextAreaElement>}
          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrin-0">
            <Button isLoading={isLoading} onClick={sendMessage} type="submit">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
