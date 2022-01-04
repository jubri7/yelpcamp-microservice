import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { Router } from "express";
import { User } from "../model/User";
import { getGoogleUser } from "../helper/googleOauth/googleUser";
import { generateError } from "../helper/generateError";

const router = Router();

router.post(
  "/api/users/google",
  body("code")
    .notEmpty()
    .withMessage(generateError(400, "Something went wrong")),
  async (req: Request, res: Response, next: NextFunction) => {
    const code = req.body.code;
    const googleUser = await getGoogleUser(code);
    let user = await User.findOne({ email: googleUser.email });
    try {
      if (!user) {
        user = await User.build({
          email: googleUser.email,
          username: googleUser.profile.firstName,
        });
        user.save();
      }
      req.session.user = user.email;
      res.send(user.email);
    } catch (err) {
      next(err);
    }
  }
);

export { router as googleSigninRoute };
