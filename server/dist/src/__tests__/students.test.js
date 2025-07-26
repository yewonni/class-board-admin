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
describe("수강생 API", () => {
    let accessToken;
    let testStudentId;
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
        // 테스트용 수강생 2명 생성
        yield prismaClient_1.default.user.createMany({
            data: [
                {
                    name: "학생1",
                    email: "student1@students_test.com",
                    isActive: true,
                    joinDate: new Date("2024-05-13"),
                },
                {
                    name: "학생2",
                    email: "student2@students_test.com",
                    isActive: true,
                    joinDate: new Date("2024-09-24"),
                },
            ],
        });
        const student = yield prismaClient_1.default.user.findFirst({
            where: { email: "student1@students_test.com" },
        });
        testStudentId = student.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // 테스트용 수강생 정리
        yield prismaClient_1.default.user.deleteMany({
            where: { email: { contains: "@students_test.com" } },
        });
    }));
    it("수강생 목록 기본 조회 성공", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/students")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty("pagination");
        expect(res.body).toHaveProperty("totalStudentsCount");
    }));
    it("수강생 목록 isActive 필터 적용", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/students?isActive=true")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.every((s) => s.isActive === true)).toBe(true);
    }));
    it("수강생 검색", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/students?search=student1")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data.some((s) => s.name.includes("student1") || s.email.includes("student1"))).toBe(true);
    }));
    it("수강생 상세 조회 성공", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get(`/students/${testStudentId}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", testStudentId);
        expect(res.body).toHaveProperty("recentLectures");
    }));
    it("수강생 상세 조회 - 없는 ID 404", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/students/999999999")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(404);
    }));
    it("수강생 수정 isActive 성공", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/students/${testStudentId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ isActive: false });
        expect(res.status).toBe(200);
        expect(res.body.isActive).toBe(false);
    }));
    it("수강생 수정 - isActive 잘못된 타입 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/students/${testStudentId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ isActive: "not_boolean" });
        expect(res.status).toBe(400);
    }));
});
