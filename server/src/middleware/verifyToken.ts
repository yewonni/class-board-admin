import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access token이 없습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    // @ts-ignore
    req.user = decoded; // 필요시 type 정의 가능
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "유효하지 않은 access token입니다." });
  }
};
