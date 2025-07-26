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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
//로그인 (access toke 발급)
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "이메일과 비밀번호 모두 필요합니다." });
    }
    try {
        const admin = yield prismaClient_1.default.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ message: "존재하지 않는 계정입니다." });
        }
        const isValid = yield bcrypt_1.default.compare(password, admin.password);
        if (!isValid) {
            return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
        }
        // 로그인 성공 시 토큰 생성
        const payload = { id: admin.id, email: admin.email };
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessToken = jsonwebtoken_1.default.sign(payload, accessTokenSecret, {
            expiresIn: "15m",
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, refreshTokenSecret, {
            expiresIn: "7d",
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ message: "success", accessToken });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
}));
// 리프레쉬 토큰 갱신
router.post("/refresh", (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "Refresh token이 없습니다." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const payload = { id: decoded.id, email: decoded.email };
        const newAccessToken = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
        });
        res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        return res
            .status(401)
            .json({ message: "Refresh token이 유효하지 않습니다." });
    }
});
// 로그아웃
router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.json({ message: "로그아웃 되었습니다." });
});
exports.default = router;
