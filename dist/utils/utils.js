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
exports.config = exports.validationError = exports.prisma = exports.setRefreshTokenCookie = exports.generateTokens = exports.generateRefreshToken = exports.generateAccesToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const generateAccesToken = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = { userId: data.id, email: data.email };
        return jsonwebtoken_1.default.sign(payload, (0, exports.config)().secret, { algorithm: 'HS256', expiresIn: '1h' });
    }
    catch (err) {
        throw err;
    }
});
exports.generateAccesToken = generateAccesToken;
const generateRefreshToken = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = { userId: data.id };
        const refreshToken = jsonwebtoken_1.default.sign(payload, (0, exports.config)().secret, { algorithm: 'HS256', expiresIn: '1d' });
        yield (0, exports.prisma)().user.update({ where: { id: payload.userId }, data: { refreshtoken: refreshToken } });
        return refreshToken;
    }
    catch (err) {
        throw err;
    }
});
exports.generateRefreshToken = generateRefreshToken;
const generateTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (0, exports.generateAccesToken)(user);
        const refreshToken = yield (0, exports.generateRefreshToken)(user);
        return { accessToken, refreshToken };
    }
    catch (err) {
        throw err;
    }
});
exports.generateTokens = generateTokens;
const setRefreshTokenCookie = (res, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('refreshToken');
        res.cookie('refreshToken', refreshToken, { maxAge: 2 * 24 * 60 * 60 * 1000, secure: true, httpOnly: true, sameSite: "lax" });
    }
    catch (err) {
        throw err;
    }
});
exports.setRefreshTokenCookie = setRefreshTokenCookie;
const prisma = () => {
    try {
        return new client_1.PrismaClient();
    }
    catch (err) {
        throw err;
    }
};
exports.prisma = prisma;
const validationError = (err, res, next) => {
    try {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ status: "error", message: "Invalid input data", errors: err.errors });
        }
        next(err);
    }
    catch (err) {
        throw err;
    }
};
exports.validationError = validationError;
const config = () => {
    try {
        return {
            dbUrl: process.env.DATABASE_URL,
            secret: process.env.JWT_SECRET,
            googelUser: process.env.USER_NAME,
            googlePass: process.env.APP_PASSWORD
        };
    }
    catch (err) {
        throw err;
    }
};
exports.config = config;
