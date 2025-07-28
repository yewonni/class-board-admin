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
// 알림 목록 조회 (카테고리 필터링 가능)
router.get("/", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = req.query.category;
        const isNew = req.query.isNew === "true"
            ? true
            : req.query.isNew === "false"
                ? false
                : undefined;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        // 필터 조건 조합
        const where = {};
        if (category)
            where.category = category;
        if (isNew !== undefined)
            where.isNew = isNew;
        const notifications = yield prismaClient_1.default.notification.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { date: "desc" },
        });
        const totalCount = yield prismaClient_1.default.notification.count({ where });
        res.json({
            data: notifications,
            pagination: { page, limit, totalCount },
        });
    }
    catch (error) {
        console.error("알림 목록 조회 실패:", error);
        res.status(500).json({ message: "알림 목록 조회 중 오류가 발생했습니다." });
    }
}));
// 알림 읽음 상태 변경
router.patch("/:id/read", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { isNew } = req.body;
        if (typeof isNew !== "boolean") {
            return res
                .status(400)
                .json({ message: "isNew 필드는 boolean 이어야 합니다." });
        }
        const updatedNotification = yield prismaClient_1.default.notification.update({
            where: { id },
            data: { isNew },
        });
        res.json({ data: updatedNotification });
    }
    catch (error) {
        console.error("알림 읽음 상태 변경 실패:", error);
        res
            .status(500)
            .json({ message: "알림 읽음 상태 변경 중 오류가 발생했습니다." });
    }
}));
exports.default = router;
//# sourceMappingURL=notifications.js.map