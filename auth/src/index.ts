import express from "express";
import mongoose from "mongoose";

const app = express();

mongoose.connect(`mongodb://${process.env.MONGODB}:3000/auth`);

app.listen(3000, () => {
  console.log("Auth server is online");
});
