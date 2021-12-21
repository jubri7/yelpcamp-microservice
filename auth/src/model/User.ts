import { Schema, model, Document } from "mongoose";
import crypto from "crypto";

export interface IUser extends Document {
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = crypto.randomBytes(16).toString("hex");

  const hashedPassword = crypto
    .pbkdf2Sync(user.password, salt, 1000, 64, `sha512`)
    .toString(`hex`);

  user.set("password", hashedPassword);
});

export const User = model<IUser>("User", UserSchema);
