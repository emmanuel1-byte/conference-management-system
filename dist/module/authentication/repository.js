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
exports.Repository = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../../utils/utils");
class Repository {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
                return yield (0, utils_1.prisma)().user.create({
                    data: Object.assign(Object.assign({}, data), { password: hashedPassword })
                });
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
    static findUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, utils_1.prisma)().user.findUnique({
                    where: {
                        email: email
                    }
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    static user(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, utils_1.prisma)().user.findUnique({
                    where: {
                        id: userId
                    },
                    select: {
                        id: true,
                        fullname: true,
                        email: true,
                        role: true,
                        password: true,
                        refreshtoken: false
                    }
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    static updateRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, utils_1.prisma)().user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        refreshtoken: ""
                    }
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    static createToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, utils_1.prisma)().token.create({
                    data: Object.assign({}, data),
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    static createBlacklist(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, utils_1.prisma)().blacklist.create({ data: { token: token } });
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.Repository = Repository;
