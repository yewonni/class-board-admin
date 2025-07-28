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
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL;
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD;
describe("로그인 API", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // 테스트용 계정이 없으면 생성, 있으면 비밀번호만 초기화
        const hashedPassword = yield bcrypt_1.default.hash(TEST_PASSWORD, 10);
        yield prismaClient_1.default.admin.upsert({
            where: { email: TEST_EMAIL },
            update: { password: hashedPassword },
            create: {
                email: TEST_EMAIL,
                password: hashedPassword,
            },
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaClient_1.default.$disconnect();
    }));
    it("로그인 성공 시 access token과 200을 반환한다.", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
    }));
    it("비밀번호가 일치하지 않으면 401을 반환한다.", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: TEST_EMAIL,
            password: "wrongpassword",
        });
        expect(res.statusCode).toBe(401);
    }));
});
//# sourceMappingURL=auth.test.js.map