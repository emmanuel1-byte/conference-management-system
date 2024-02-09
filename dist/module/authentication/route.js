"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const middleware_1 = require("../../middleware/middleware");
const auth = express_1.default.Router();
auth.post('/signup', middleware_1.Middleware.verifySignUp, controller_1.Auth.signUp);
auth.post('/login', controller_1.Auth.login);
auth.post('/google-signup');
auth.post('/google-login');
auth.post('/logout');
exports.default = auth;
