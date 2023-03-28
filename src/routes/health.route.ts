import { NextFunction, Request, Response, Router } from "express";

export const HealthRouter: Router = Router();

HealthRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("Successfully check API health.");
  res
    .status(200)
    .send({ status: true, statusCode: 200, message: "Server is running..." });
});
