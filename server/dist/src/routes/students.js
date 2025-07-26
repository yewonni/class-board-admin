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
// 수강생 리스트 조회 (페이징, 필터링, 검색 추가)
router.get("/", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const isActive = req.query.isActive === "true"
            ? true
            : req.query.isActive === "false"
                ? false
                : undefined;
        const search = typeof req.query.search === "string" && req.query.search.trim() !== ""
            ? req.query.search.trim()
            : undefined;
        const where = {};
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        if (search) {
            where.OR = [
                { email: { contains: search } },
                { name: { contains: search } },
            ];
        }
        const students = yield prismaClient_1.default.user.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { joinDate: "desc" },
        });
        const totalCount = yield prismaClient_1.default.user.count({ where });
        const totalStudentsCount = yield prismaClient_1.default.user.count();
        res.json({
            data: students,
            pagination: { page, limit, totalCount },
            totalStudentsCount,
        });
    }
    catch (error) {
        console.error("Error fetching students:", error);
        res
            .status(500)
            .json({ message: "수강생 목록 조회 중 오류가 발생했습니다." });
    }
}));
// 수강생 상세 조회 + 최근 수강 내역 포함
router.get("/:id", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const student = yield prismaClient_1.default.user.findUnique({
            where: { id },
        });
        if (!student) {
            return res.status(404).json({ message: "수강생을 찾을 수 없습니다." });
        }
        const recentEnrollments = yield prismaClient_1.default.enrollment.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "수강생 조회 중 오류가 발생했습니다." });
    }
}));
//수강생 수정
router.put("/:id", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            return res
                .status(400)
                .json({ message: "isActive 필드는 boolean이어야 합니다." });
        }
        const updated = yield prismaClient_1.default.user.update({
            where: { id },
            data: { isActive },
        });
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "수강생 수정 중 오류가 발생했습니다." });
    }
}));
exports.default = router;
