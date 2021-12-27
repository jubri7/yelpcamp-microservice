import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { Router } from "express";
import { IUser, User } from "../model/User";

const router = Router();

router.post(
  "/signup",
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
      if (errors.isEmpty()) throw new Error(JSON.stringify(errors.array()));

      if (await User.findOne({ username }))
        throw new Error(
          JSON.stringify({ statusCode: 400, message: "User already exist" })
        );

      const user: IUser = await User.create({ username, password });
      await user.save();

      req.session.user = username;
      res.status(201).send(username);
    } catch (err) {
      next(err);
    }
  }
);

export { router as signupRoute };
