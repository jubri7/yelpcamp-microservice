import { Response, Request, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: [{ statusCode: number; message: string }] = JSON.parse(
    err.message
  );

  if (error.length == 1) {
    res.status(error[0].statusCode).send([error[0].message]);
  } else if (error.length > 1) {
    res
      .status(error[0].statusCode)
      .send(error.map((errorObject) => errorObject.message));
  } else {
    res.status(500).send("Something went wrong");
  }
};
