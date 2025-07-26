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
const client_1 = require("@prisma/client");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
// 강의 리스트 조회 (페이징, 상태 필터링, 강의명 검색 추가)
router.get("/", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const status = req.query.status;
        const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
        const where = {};
        if (status) {
            where.status = status;
        }
        if (search) {
            where.title = {
                contains: search,
            };
        }
        const lectures = yield prismaClient_1.default.lecture.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { openDate: "desc" },
        });
        const lectureWithCounts = yield Promise.all(lectures.map((lecture) => __awaiter(void 0, void 0, void 0, function* () {
            const count = yield prismaClient_1.default.enrollment.count({
                where: { lectureId: lecture.id },
            });
            return Object.assign(Object.assign({}, lecture), { studentCount: count });
        })));
        const totalCount = yield prismaClient_1.default.lecture.count({ where });
        const totalLecturesCount = yield prismaClient_1.default.lecture.count();
        res.json({
            data: lectureWithCounts,
            pagination: { page, limit, totalCount },
            totalLecturesCount,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "강의 목록 조회 중 오류가 발생했습니다." });
    }
}));
// 강의 상세 조회
router.get("/:id", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const lecture = yield prismaClient_1.default.lecture.findUnique({
            where: { id },
        });
        if (!lecture) {
            return res.status(404).json({ message: "강의를 찾을 수 없습니다." });
        }
        const enrollments = yield prismaClient_1.default.enrollment.findMany({
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
        const avgProgress = enrollments.length > 0
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "강의 조회 중 오류가 발생했습니다." });
    }
}));
// 강의 상태 변경
router.put("/:id", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        if (!status || !Object.values(client_1.LectureStatus).includes(status)) {
            return res
                .status(400)
                .json({ message: "유효한 강의 상태를 입력해주세요." });
        }
        const updatedLecture = yield prismaClient_1.default.lecture.update({
            where: { id },
            data: { status },
        });
        res.json(updatedLecture);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "강의 상태 변경 중 오류가 발생했습니다." });
    }
}));
exports.default = router;
