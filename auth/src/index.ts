import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import { signinRoute } from "./routes/signin";
import { signupRoute } from "./routes/signup";
import { sessionUser } from "./middleware/session";
import redisClient from "./redis";
import { logoutRoute } from "./routes/logout";

const app = express();
const RedisStore = require("connect-redis")(session);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION!,
  })
);

app.use(sessionUser);

app.use(signinRoute);
app.use(signupRoute);
app.use(logoutRoute);

mongoose.connect(process.env.MONGODB!);

app.listen(3000, () => {
  console.log("Auth server is online");
});
