const uptashRedisrestUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!uptashRedisrestUrl || !authToken) {
  throw new Error("Environment variables for Upstash Redis are not set.");
}

type Command = "zrange" | "sismember" | "get" | "smembers";

const fetchRedis = async (
  command: Command,
  ...args: (string | number)[]
): Promise<any> => {
  const commandUrl = `${uptashRedisrestUrl}/${command}/${args.join("/")}`;
  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(
      `Error executing ${command} command: ${response.statusText}`,
    );
  }
  const data = await response.json();
  if (data.error) {
    throw new Error(`Error in the received data: ${data.error}`);
  }
  return data.result;
};

export default fetchRedis;
