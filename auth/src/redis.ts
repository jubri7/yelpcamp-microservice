import { createClient } from "redis";

const redisClient = createClient({ url: process.env.REDIS! });

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.connect();

export default redisClient;
