import express, { Request, Response } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

const router = express.Router();

//로그인 (access toke 발급)
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "이메일과 비밀번호 모두 필요합니다." });
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(401).json({ message: "존재하지 않는 계정입니다." });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
    }

    // 로그인 성공 시 토큰 생성
    const payload = { id: admin.id, email: admin.email };

    const accessTokenSecret: Secret = process.env.ACCESS_TOKEN_SECRET!;
    const refreshTokenSecret: Secret = process.env.REFRESH_TOKEN_SECRET!;

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "로그인 성공", accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
});

// 리프레쉬 토큰 갱신
router.post("/refresh", (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Refresh token이 없습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
    const payload = { id: (decoded as any).id, email: (decoded as any).email };

    const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "15m",
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Refresh token이 유효하지 않습니다." });
  }
});

// 로그아웃
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ message: "로그아웃 되었습니다." });
});

export default router;
