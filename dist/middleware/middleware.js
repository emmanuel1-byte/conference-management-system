"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const repository_1 = require("../module/authentication/repository");
const utils_1 = require("../utils/utils");
class Middleware {
    static verifySignUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doesExist = yield repository_1.Repository.findUser(req.body.email);
                if (doesExist)
                    return res.status(400).json({ status: "error", message: "Email is already in use!" });
                next();
            }
            catch (err) {
                next(err);
            }
        });
    }
    // Token Middleware
    static catchError(err, res, next) {
        try {
            if (err instanceof jsonwebtoken_1.TokenExpiredError)
                return res.status(401).json({ status: "error", message: "Unauthorized! token has expired" });
            return res.status(401).json({ status: "error", message: "Unauthorized!" });
        }
        catch (err) {
            next(err);
        }
    }
    static verifyJwt(req, res, next) {
        var _b;
        try {
            const token = (_b = req.headers.authorization) !== null && _b !== void 0 ? _b : "";
            jsonwebtoken_1.default.verify(token, (0, utils_1.config)().secret, (err, decoded) => {
                if (err)
                    this.catchError(err, res, next);
                if (decoded)
                    req.user = decoded;
            });
            next();
        }
        catch (err) {
            next(err);
        }
    }
}
exports.Middleware = Middleware;
_a = Middleware;
// Role Based access controll
Middleware.checkUserRole = (allowedRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const user = yield (0, utils_1.prisma)().user.findUnique({ where: { id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id } });
            if (!user)
                return res.status(404).json({ status: "error", message: "User not found!" });
            const userRole = user.role || [];
            const hasPermission = allowedRole.some((role) => userRole.includes(role));
            if (hasPermission)
                next();
            return res.status(403).json({ status: "error", message: "Unauthorized!" });
        }
        catch (err) {
            next(err);
        }
    });
};
