import { createClient } from "redis";

const redisClient = createClient({
  socket: { host: process.env.REDIS! },
  legacyMode: true,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.on("connect", (err) => {
  console.log("Redis is online");
});

redisClient.connect();

export default redisClient;
