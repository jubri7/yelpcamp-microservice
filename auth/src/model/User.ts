import { Schema, model } from "mongoose";

interface User {
  username: string;
  password: string;
}

const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = model<User>("User", UserSchema);
