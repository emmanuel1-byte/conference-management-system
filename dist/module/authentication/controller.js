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
exports.Auth = void 0;
const schema_1 = require("./schema");
const repository_1 = require("./repository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const emitter_1 = __importDefault(require("../../events/auth/emitter"));
const utils_1 = require("../../utils/utils");
class Auth {
    static signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResult = schema_1.SignUpSchema.parse(req.body);
                const data = yield repository_1.Repository.create(validationResult);
                if (!data)
                    return res.status(500).json({ status: "error", message: "Not created" });
                emitter_1.default.emit('signUp', validationResult);
                return res.status(201).json({ message: "Registration successfull", data });
            }
            catch (err) {
                (0, utils_1.validationError)(err, res, next);
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResult = schema_1.loginSchema.parse(req.body);
                const user = yield repository_1.Repository.findUser(validationResult.email);
                const isPasswordCorrect = user && (yield bcryptjs_1.default.compare(validationResult.password, user.password));
                if (!isPasswordCorrect)
                    return res.status(400).json({ status: "error", message: "Invalid credentials" });
                const currentUser = yield repository_1.Repository.user(user.id);
                const { accessToken, refreshToken } = yield (0, utils_1.generateTokens)(user);
                (0, utils_1.setRefreshTokenCookie)(res, refreshToken);
                return res.status(200).json({ status: "Ok", message: "Login successfull", user: currentUser, access_token: accessToken });
            }
            catch (err) {
                (0, utils_1.validationError)(err, res, next);
            }
        });
    }
    static googleSignUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (err) {
                (0, utils_1.validationError)(err, res, next);
            }
        });
    }
    static googleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static refreshAccessToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken, refreshToken } = yield (0, utils_1.generateTokens)(req.user);
                (0, utils_1.setRefreshTokenCookie)(res, refreshToken);
                return res.status(200).json({ status: "Ok", message: "Access token refreshed!", data: accessToken });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static logout(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) !== null && _b !== void 0 ? _b : "[]";
                const refreshToken = (_c = req.cookies) === null || _c === void 0 ? void 0 : _c.refreshToken;
                yield repository_1.Repository.createBlacklist(accessToken);
                res.clearCookie(refreshToken);
                return res.status(204).json({});
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.Auth = Auth;
