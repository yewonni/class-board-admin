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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL;
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD;
describe("알림 API", () => {
    let accessToken;
    let testNotificationId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash(TEST_PASSWORD, 10);
        yield prismaClient_1.default.admin.upsert({
            where: { email: TEST_EMAIL },
            update: { password: hashedPassword },
            create: {
                email: TEST_EMAIL,
                password: hashedPassword,
            },
        });
        const res = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });
        accessToken = res.body.accessToken;
        // 테스트용 알림 2개 생성
        yield prismaClient_1.default.notification.createMany({
            data: [
                {
                    message: "테스트알림1",
                    category: "공지",
                    date: new Date("2024-05-14"),
                    isNew: false,
                },
                {
                    message: "테스트알림2",
                    category: "과제",
                    date: new Date("2024-07-29"),
                    isNew: true,
                },
            ],
        });
        const notification = yield prismaClient_1.default.notification.findFirst({
            where: { message: "테스트알림1" },
        });
        testNotificationId = notification.id;
    }));
    // 테스트용 강의 정리
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaClient_1.default.notification.deleteMany({
            where: { message: { contains: "테스트알림" } },
        });
    }));
    it("알림 목록 기본 조회", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/notifications")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    }));
    it("알림 필터 성공 (category=공지)", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/notifications?category=공지")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.every((n) => n.category === "공지")).toBe(true);
    }));
    it("isNew 필터가 정상 동작하는지 확인", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/notifications?isNew=true")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.every((n) => n.isNew === true)).toBe(true);
    }));
    it("알림 읽음 상태 변경 성공", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .patch(`/notifications/${testNotificationId}/read`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ isNew: false });
        expect(res.status).toBe(200);
        expect(res.body.data.isNew).toBe(false);
    }));
});
