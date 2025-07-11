import express, { Response } from "express";
import prisma from "../prismaClient";
import { LectureStatus } from "@prisma/client";
import { verifyToken, CustomRequest } from "../middleware/verifyToken";

const router = express.Router();

// 강의 리스트 조회 (페이징, 상태 필터링, 강의명 검색 추가)
router.get("/", verifyToken, async (req: CustomRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const status = req.query.status as LectureStatus | undefined;
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const where: any = {};
    if (status) {
      where.status = status;
    }

    if (search) {
      where.title = {
        contains: search,
      };
    }

    const lectures = await prisma.lecture.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { openDate: "desc" },
    });

    const lectureWithCounts = await Promise.all(
      lectures.map(async (lecture) => {
        const count = await prisma.enrollment.count({
          where: { lectureId: lecture.id },
        });

        return {
          ...lecture,
          studentCount: count,
        };
      })
    );

    const totalCount = await prisma.lecture.count({ where });
    const totalLecturesCount = await prisma.lecture.count();

    res.json({
      data: lectureWithCounts,
      pagination: { page, limit, totalCount },
      totalLecturesCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "강의 목록 조회 중 오류가 발생했습니다." });
  }
});

// 강의 상세 조회
router.get("/:id", verifyToken, async (req: CustomRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const lecture = await prisma.lecture.findUnique({
      where: { id },
    });

    if (!lecture) {
      return res.status(404).json({ message: "강의를 찾을 수 없습니다." });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { lectureId: id },
      include: {
        user: true,
      },
    });

    const students = enrollments.map((enroll) => ({
      id: enroll.user.id,
      name: enroll.user.name,
      email: enroll.user.email,
    }));

    const totalProgress = enrollments.reduce((sum, e) => sum + e.progress, 0);
    const avgProgress =
      enrollments.length > 0
        ? `${Math.round(totalProgress / enrollments.length)}%`
        : "0%";

    res.json({
      id: lecture.id,
      title: lecture.title,
      instructor: lecture.instructor,
      openDate: lecture.openDate,
      status: lecture.status,
      studentCount: enrollments.length,
      progress: avgProgress,
      students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "강의 조회 중 오류가 발생했습니다." });
  }
});

// 강의 상태 변경
router.put("/:id", verifyToken, async (req: CustomRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!status || !Object.values(LectureStatus).includes(status)) {
      return res
        .status(400)
        .json({ message: "유효한 강의 상태를 입력해주세요." });
    }

    const updatedLecture = await prisma.lecture.update({
      where: { id },
      data: { status },
    });

    res.json(updatedLecture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "강의 상태 변경 중 오류가 발생했습니다." });
  }
});

export default router;
