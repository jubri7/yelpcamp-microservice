import { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    user: string | null;
  }
}

export const sessionUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ("user" in req.session) {
    next();
  } else {
    req.session.user = null;
    next();
  }
};
