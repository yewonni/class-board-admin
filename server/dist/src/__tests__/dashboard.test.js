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
describe("대시보드 API", () => {
    let accessToken;
    let createdDashboardLectures = [];
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
        // 로그인 요청으로 토큰 확보
        const res = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });
        accessToken = res.body.accessToken;
        // 테스트용 강의 2개 생성
        const dashboardLecture1 = yield prismaClient_1.default.lecture.create({
            data: {
                title: "React 입문",
                instructor: "홍길동",
                openDate: new Date("2024-01-01"),
                status: "진행중",
            },
        });
        const dashboardLecture2 = yield prismaClient_1.default.lecture.create({
            data: {
                title: "Node.js 완전정복",
                instructor: "김개발",
                openDate: new Date("2024-02-01"),
                status: "예정",
            },
        });
        createdDashboardLectures = [dashboardLecture1, dashboardLecture2];
        // 테스트용 수강생 2명 + 수강 등록
        const dashboardStudent1 = yield prismaClient_1.default.user.create({
            data: {
                name: "학생1",
                email: "student1@dashboard_test.com",
                isActive: true,
                joinDate: new Date("2024-03-15"),
            },
        });
        const dashboardStudent2 = yield prismaClient_1.default.user.create({
            data: {
                name: "학생2",
                email: "student2@dashboard_test.com",
                isActive: true,
                joinDate: new Date("2024-03-20"),
            },
        });
        yield prismaClient_1.default.enrollment.createMany({
            data: [
                {
                    userId: dashboardStudent1.id,
                    lectureId: createdDashboardLectures[0].id,
                    enrollDate: new Date("2024-04-01"),
                    progress: 80,
                },
                {
                    userId: dashboardStudent2.id,
                    lectureId: createdDashboardLectures[0].id,
                    enrollDate: new Date("2024-04-01"),
                    progress: 60,
                },
                {
                    userId: dashboardStudent2.id,
                    lectureId: createdDashboardLectures[1].id,
                    enrollDate: new Date("2024-04-02"),
                    progress: 90,
                },
            ],
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // 테스트 데이터 정리
        yield prismaClient_1.default.enrollment.deleteMany({
            where: {
                user: {
                    email: {
                        contains: "@dashboard_test.com",
                    },
                },
            },
        });
        yield prismaClient_1.default.user.deleteMany({
            where: { email: { contains: "@dashboard_test.com" } },
        });
        yield prismaClient_1.default.lecture.deleteMany({
            where: {
                id: { in: createdDashboardLectures.map((lec) => lec.id) },
            },
        });
        yield prismaClient_1.default.$disconnect();
    }));
    it("월별 신규 수강생 수 조회", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/dashboard/students/monthly")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        const hasMarch = res.body.some((item) => item.month.includes("2024-03"));
        expect(hasMarch).toBe(true);
    }));
    it("강의별 평균 진도율 조회", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/dashboard/progress/course")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty("lectureId");
        expect(res.body[0]).toHaveProperty("lectureTitle");
        expect(res.body[0]).toHaveProperty("avgProgress");
    }));
});
//# sourceMappingURL=dashboard.test.js.map