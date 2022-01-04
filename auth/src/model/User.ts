import { Schema, model, Document, Model } from "mongoose";
import crypto from "crypto";

export interface IUser extends Document {
  username?: string;
  password?: string;
  email: string;
}

interface UserModel extends Model<IUser> {
  build(
    email: string | {},
    password?: string,
    username?: string | {}
  ): Promise<
    IUser & {
      _id: any;
    }
  >;
}

const UserSchema = new Schema({
  username: String,
  password: String,
  email: { type: String, required: true },
});

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = crypto.randomBytes(16).toString("hex");

  const hashedPassword = crypto
    .pbkdf2Sync(user.password, salt, 1000, 64, `sha512`)
    .toString(`hex`);

  user.set("password", hashedPassword);

  next();
});

UserSchema.statics.build = async function (
  email: string | {},
  password?: string,
  username?: string | {}
) {
  const user = await User.create({
    email,
    password: password || null,
    username: username || null,
  });
  return user;
};

export const User = model<IUser, UserModel>("User", UserSchema);
