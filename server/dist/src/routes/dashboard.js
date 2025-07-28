"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
// 전체 평균 진행율 조회
router.get("/progress", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield prismaClient_1.default.enrollment.aggregate({
            _avg: { progress: true },
        });
        res.json({ averageProgress: Math.round((_a = result._avg.progress) !== null && _a !== void 0 ? _a : 0) });
    }
    catch (error) {
        console.error("전체 평균 진행율 조회 실패:", error);
        res.status(500).json({ message: "진행율 조회 중 오류가 발생했습니다." });
    }
}));
// 월별 신규 수강생 수
router.get("/students/monthly", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentsByMonth = yield prismaClient_1.default.user.groupBy({
            by: ["joinDate"],
            _count: { id: true },
        });
        const monthMap = {};
        studentsByMonth.forEach((entry) => {
            const date = entry.joinDate;
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            monthMap[monthKey] = (monthMap[monthKey] || 0) + entry._count.id;
        });
        const result = Object.entries(monthMap)
            .sort(([a], [b]) => (a > b ? 1 : -1))
            .map(([month, count]) => ({ month, count }));
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "월별 수강생 수 조회 중 오류 발생" });
    }
}));
// 강의별 평균 진행률 조회
router.get("/progress/course", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseProgress = yield prismaClient_1.default.enrollment.groupBy({
            by: ["lectureId"],
            _avg: { progress: true },
        });
        // 강의 제목 가져오기 위해 lecture 테이블에서 강의 id별 조회
        const lectureIds = courseProgress.map((item) => item.lectureId);
        const lectures = yield prismaClient_1.default.lecture.findMany({
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
    }
    catch (error) {
        console.error("강의별 평균 진행률 조회 실패:", error);
        res
            .status(500)
            .json({ message: "강의별 진행률 조회 중 오류가 발생했습니다." });
    }
}));
exports.default = router;
//# sourceMappingURL=dashboard.js.map