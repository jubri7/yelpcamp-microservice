import { Request, Response, NextFunction } from "express";
import { Router } from "express";

const router = Router();

router.get(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = "";
    res.send("Logout successful");
  }
);

export { router as signoutRoute };
