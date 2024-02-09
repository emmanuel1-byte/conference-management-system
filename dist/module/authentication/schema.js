"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.SignUpSchema = void 0;
const zod_1 = require("zod");
exports.SignUpSchema = zod_1.z.object({
    fullname: zod_1.z.string().min(5),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['Partcipant', 'Speaker', 'Organizer']),
    password: zod_1.z.string()
})
    .required();
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
})
    .required();
