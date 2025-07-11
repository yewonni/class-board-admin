import express, { Response } from "express";
import prisma from "../prismaClient";
import { verifyToken, CustomRequest } from "../middleware/verifyToken";
import { Category } from "@prisma/client";

const router = express.Router();

// 알림 목록 조회 (카테고리 필터링 가능)
router.get("/", verifyToken, async (req: CustomRequest, res: Response) => {
  try {
    const category = req.query.category as Category | undefined;
    const isNew =
      req.query.isNew === "true"
        ? true
        : req.query.isNew === "false"
        ? false
        : undefined;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    // 필터 조건 조합
    const where: any = {};
    if (category) where.category = category;
    if (isNew !== undefined) where.isNew = isNew;

    const notifications = await prisma.notification.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { date: "desc" },
    });

    const totalCount = await prisma.notification.count({ where });

    res.json({
      data: notifications,
      pagination: { page, limit, totalCount },
    });
  } catch (error) {
    console.error("알림 목록 조회 실패:", error);
    res.status(500).json({ message: "알림 목록 조회 중 오류가 발생했습니다." });
  }
});

// 알림 읽음 상태 변경
router.patch(
  "/:id/read",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { isNew } = req.body;

      if (typeof isNew !== "boolean") {
        return res
          .status(400)
          .json({ message: "isNew 필드는 boolean 이어야 합니다." });
      }

      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: { isNew },
      });

      res.json({ data: updatedNotification });
    } catch (error) {
      console.error("알림 읽음 상태 변경 실패:", error);
      res
        .status(500)
        .json({ message: "알림 읽음 상태 변경 중 오류가 발생했습니다." });
    }
  }
);

export default router;
