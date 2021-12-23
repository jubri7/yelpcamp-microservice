import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { Router } from "express";
import { IUser, User } from "../model/User";

const router = Router();

router.post(
  "/signin",
  body("username")
    .notEmpty()
    .withMessage({ statusCode: 400, message: "Invalid username/password" }),
  body("password")
    .notEmpty()
    .withMessage({ statusCode: 400, message: "Invalid username/password" }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const { username, password } = req.body;
    try {
      if (!errors.isEmpty()) throw new Error(JSON.stringify(errors.array()));

      let user = await User.findOne({ username });
      if (!user)
        throw new Error(
          JSON.stringify({
            statusCode: 401,
            message: "Invalid username/password",
          })
        );

      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);
      if (hash !== user.password)
        throw new Error(
          JSON.stringify({
            statusCode: 401,
            message: "Invalid username/password",
          })
        );

      req.session.user = username;
      res.send(username);
    } catch (err) {
      next(err);
    }
  }
);

export { router as signinRoute };
