import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { Router } from "express";
import { IUser, User } from "../model/User";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email")
      .isEmail()
      .notEmpty()
      .withMessage({ statusCode: 400, message: "Invalid email/password" }),
    body("password")
      .notEmpty()
      .withMessage({ statusCode: 400, message: "Invalid email/password" }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const { email, password } = req.body;
    try {
      if (!errors.isEmpty()) throw new Error(JSON.stringify(errors.array()));

      if (await User.findOne({ email }))
        throw new Error(
          JSON.stringify({ statusCode: 400, message: "User already exist" })
        );

      const user: IUser = await User.create({ email, password });
      await user.save();

      req.session.user = email;
      res.status(201).send(email);
    } catch (err) {
      next(err);
    }
  }
);

export { router as signupRoute };
