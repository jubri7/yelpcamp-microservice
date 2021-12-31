import { Request, Response, NextFunction } from "express";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    user: string;
  }
}

declare global {
  namespace session {
    interface SessionData {
      user: string;
    }
  }
}

export const sessionUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("here");
  if (req.session.user) {
    next();
  } else {
    req.session.user = "";
    next();
  }
};
