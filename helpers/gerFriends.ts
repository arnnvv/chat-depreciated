import fetchRedis from "./redis";

const getFriends: (userId: string) => Promise<User[]> = async (
  userId: string,
): Promise<User[]> => {
  const friendIds = (await fetchRedis(
    `smembers`,
    `user:${userId}:friends`,
  )) as string[];

  const friends: User[] = await Promise.all(
    friendIds.map(async (friendId: string): Promise<User> => {
      const friend = await fetchRedis("get", `user:${friendId}`);
      return JSON.parse(friend) as User;
    }),
  );

  return friends;
};

export default getFriends;
