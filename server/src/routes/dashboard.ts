import express, { Response } from "express";
import prisma from "../prismaClient";
import { verifyToken, CustomRequest } from "../middleware/verifyToken";

const router = express.Router();

// 전체 평균 진행율 조회
router.get(
  "/progress",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    try {
      const enrollments = await prisma.enrollment.findMany();

      const totalProgress = enrollments.reduce((sum, e) => sum + e.progress, 0);
      const avgProgress = enrollments.length
        ? Math.round(totalProgress / enrollments.length)
        : 0;

      res.json({ averageProgress: avgProgress });
    } catch (error) {
      console.error("전체 평균 진행율 조회 실패:", error);
      res.status(500).json({ message: "진행율 조회 중 오류가 발생했습니다." });
    }
  }
);

// 월별 신규 수강생 수
router.get(
  "/students/monthly",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    try {
      const studentsByMonth = await prisma.user.groupBy({
        by: ["joinDate"],
        _count: { id: true },
      });

      const monthMap: Record<string, number> = {};

      studentsByMonth.forEach((entry) => {
        const date = entry.joinDate;
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        monthMap[monthKey] = (monthMap[monthKey] || 0) + entry._count.id;
      });

      const result = Object.entries(monthMap)
        .sort(([a], [b]) => (a > b ? 1 : -1))
        .map(([month, count]) => ({ month, count }));

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "월별 수강생 수 조회 중 오류 발생" });
    }
  }
);
// 강의별 평균 진행률 조회
router.get(
  "/progress/course",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    try {
      const courseProgress = await prisma.enrollment.groupBy({
        by: ["lectureId"],
        _avg: { progress: true },
      });

      // 강의 제목 가져오기 위해 lecture 테이블에서 강의 id별 조회
      const lectureIds = courseProgress.map((item) => item.lectureId);
      const lectures = await prisma.lecture.findMany({
        where: { id: { in: lectureIds } },
        select: { id: true, title: true },
      });
      const lectureMap = new Map(lectures.map((lec) => [lec.id, lec.title]));

      const result = courseProgress.map((item) => ({
        lectureId: item.lectureId,
        lectureTitle: lectureMap.get(item.lectureId) || "알 수 없음",
        avgProgress: Math.round(item._avg.progress || 0),
      }));

      res.json(result);
    } catch (error) {
      console.error("강의별 평균 진행률 조회 실패:", error);
      res
        .status(500)
        .json({ message: "강의별 진행률 조회 중 오류가 발생했습니다." });
    }
  }
);

export default router;
