import { Response, Request, NextFunction, Errback } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = JSON.parse(err.message);

  if ("statusCode" in error) {
    res.status(error.statusCode).send([error.message]);
  } else {
    res.status(500).send("Something went wrong");
  }
};
