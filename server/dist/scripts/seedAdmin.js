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
const prismaClient_1 = __importDefault(require("../src/prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function seedAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = process.env.SEED_ADMIN_EMAIL;
        const plainPassword = process.env.SEED_ADMIN_PASSWORD;
        if (!email || !plainPassword) {
            throw new Error("환경 변수 SEED_ADMIN_EMAIL 또는 SEED_ADMIN_PASSWORD가 설정되지 않았습니다.");
        }
        const hashedPassword = yield bcrypt_1.default.hash(plainPassword, 10);
        // 이미 있는지 체크
        const existing = yield prismaClient_1.default.admin.findUnique({ where: { email } });
        if (existing) {
            console.log("이미 해당 이메일의 계정이 존재합니다.");
            return;
        }
        // 새 관리자 생성
        yield prismaClient_1.default.admin.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        console.log("관리자 계정이 생성되었습니다.");
    });
}
seedAdmin()
    .catch((err) => console.error("시드 중 오류 발생:", err))
    .finally(() => prismaClient_1.default.$disconnect());
//# sourceMappingURL=seedAdmin.js.map