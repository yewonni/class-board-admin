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
describe("강의 API", () => {
    let accessToken;
    let testLectureId;
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
        // 테스트용 강의 2개 생성
        yield prismaClient_1.default.lecture.createMany({
            data: [
                {
                    title: "테스트강의1",
                    instructor: "테스트강사1",
                    openDate: new Date("2024-02-14"),
                    status: "예정",
                },
                {
                    title: "테스트강의2",
                    instructor: "테스트강사2",
                    openDate: new Date("2024-09-24"),
                    status: "진행중",
                },
            ],
        });
        const lecture = yield prismaClient_1.default.lecture.findFirst({
            where: { title: "테스트강의1" },
        });
        testLectureId = lecture.id;
    }));
    //테스트용 강의 정리
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaClient_1.default.lecture.deleteMany({
            where: { title: { contains: "테스트강의" } },
        });
    }));
    it("강의 목록 기본 조회 성공", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/courses")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty("pagination");
    }));
    it("강의명 검색 ", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/courses?search=테스트강의1")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data.every((l) => l.title.includes("테스트강의1"))).toBe(true);
    }));
    it("강의 목록 상태 필터 적용", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/courses?status=예정")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.every((s) => s.status === "예정")).toBe(true);
    }));
    it("강의 상세 조회 성공", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get(`/courses/${testLectureId}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", testLectureId);
    }));
    it("강의 status 수정 성공", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/courses/${testLectureId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ status: "진행중" });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("진행중");
    }));
});
