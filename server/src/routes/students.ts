import express, { Response } from "express";
import prisma from "../prismaClient";
import { verifyToken, CustomRequest } from "../middleware/verifyToken";

const router = express.Router();

// 수강생 리스트 조회 (페이징, 필터링, 검색 추가)
router.get("/", verifyToken, async (req: CustomRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const isActive =
      req.query.isActive === "true"
        ? true
        : req.query.isActive === "false"
        ? false
        : undefined;

    const search =
      typeof req.query.search === "string" && req.query.search.trim() !== ""
        ? req.query.search.trim()
        : undefined;

    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
      ];
    }

    const students = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { joinDate: "desc" },
    });

    const totalCount = await prisma.user.count({ where });

    const totalStudentsCount = await prisma.user.count();

    res.json({
      data: students,
      pagination: { page, limit, totalCount },
      totalStudentsCount,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res
      .status(500)
      .json({ message: "수강생 목록 조회 중 오류가 발생했습니다." });
  }
});

// 수강생 상세 조회 + 최근 수강 내역 포함
router.get("/:id", verifyToken, async (req: CustomRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const student = await prisma.user.findUnique({
      where: { id },
    });

    if (!student) {
      return res.status(404).json({ message: "수강생을 찾을 수 없습니다." });
    }

    const recentEnrollments = await prisma.enrollment.findMany({
      where: { userId: id },
      include: {
        lecture: true,
      },
      orderBy: {
        enrollDate: "desc",
      },
      take: 3,
    });

    const recentLectures = recentEnrollments.map((enrollment) => ({
      id: enrollment.lecture.id,
      name: enrollment.lecture.title,
      startDate: enrollment.enrollDate.toISOString().split("T")[0],
      progress: `${enrollment.progress}%`,
    }));

    res.json({
      id: student.id,
      name: student.name,
      email: student.email,
      joinDate: student.joinDate,
      isActive: student.isActive,
      recentLectures,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "수강생 조회 중 오류가 발생했습니다." });
  }
});

//수강생 수정
router.put("/:id", verifyToken, async (req: CustomRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "isActive 필드는 boolean이어야 합니다." });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "수강생 수정 중 오류가 발생했습니다." });
  }
});

export default router;
