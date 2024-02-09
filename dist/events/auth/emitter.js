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
const events_1 = __importDefault(require("events"));
const uuid_1 = require("uuid");
const service_1 = require("../../service/service");
const repository_1 = require("../../module/authentication/repository");
const auth = new events_1.default();
auth.on('signUp', (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, uuid_1.v4)();
        const tokenData = {
            type: 'Verification_Email',
            token: token,
            email: data.email,
            expireIn: new Date()
        };
        yield repository_1.Repository.createToken(tokenData);
        const emailContent = {
            to: data.email,
            subject: 'Welcome to conference management system ',
            html: `<h3>Please click <a href="${'http://localhost:${token}'}">here</a> to verify your email</h3>`
        };
        service_1.Service.email(emailContent);
    }
    catch (err) {
        throw err;
    }
}));
exports.default = auth;
