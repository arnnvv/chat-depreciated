import { z } from "zod";

export const friendRequestScheema = z.object({
  email: z.string().email(),
});

export const messageScheema = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const messagesScheema = z.array(messageScheema);

export type FriendRequest = z.infer<typeof friendRequestScheema>;

export type Message = z.infer<typeof messageScheema>;

export type Messages = z.infer<typeof messagesScheema>;

export const validateFriendRequest = (data: FriendRequest): boolean => {
  const result = friendRequestScheema.safeParse(data);
  return result.success;
};

export const validateMessage = (data: Message): boolean => {
  const result = messageScheema.safeParse(data);
  return result.success;
};

export const validateMessages = (data: Messages): boolean => {
  const result = messagesScheema.safeParse(data);
  return result.success;
};
