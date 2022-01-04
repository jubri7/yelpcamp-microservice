import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { Router } from "express";
import { User } from "../model/User";
import { generateError } from "../helper/generateError";

const router = Router();

router.post(
  "/api/users/signin",
  [
    body("email")
      .isEmail()
      .notEmpty()
      .withMessage(generateError(400, "Invalid email/password")),
    body("password")
      .notEmpty()
      .withMessage(generateError(400, "Invalid email/password")),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const { email, password } = req.body;
    try {
      if (!errors.isEmpty())
        throw new Error(
          JSON.stringify(
            errors
              .array()
              .map((err) => generateError(err.msg.statusCode, err.msg.message))
          )
        );

      let user = await User.findOne({ email });
      if (!user)
        throw new Error(
          JSON.stringify([generateError(401, "Invalid email/password")])
        );

      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);
      if (hash !== user.password)
        throw new Error(
          JSON.stringify([generateError(401, "Invalid email/password")])
        );

      req.session.user = email;
      res.send(email);
    } catch (err) {
      next(err);
    }
  }
);

export { router as signinRoute };
