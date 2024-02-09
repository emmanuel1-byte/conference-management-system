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
exports.Service = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const googleapis_1 = require("googleapis");
const paystack_sdk_1 = require("paystack-sdk");
const utils_1 = require("../utils/utils");
class Service {
    static email(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: (0, utils_1.config)().googelUser,
                        pass: (0, utils_1.config)().googlePass
                    }
                });
                const info = yield transporter.sendMail({
                    from: (0, utils_1.config)().googelUser,
                    to: data.to,
                    subject: data.subject,
                    html: data.html
                });
                if (!info) {
                    console.log("Email not sent");
                }
                console.log("Email sent: % ", info.messageId);
            }
            catch (err) {
                throw err;
            }
        });
    }
    static upload() {
        try {
            const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
                cloudinary: cloudinary_1.default.v2,
                params: (req, file) => __awaiter(this, void 0, void 0, function* () {
                    return {
                        folder: 'conference-management-system',
                        format: ['jpeg', 'png'],
                    };
                })
            });
            return storage;
        }
        catch (err) {
            throw err;
        }
    }
    static OAuth2() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providers = {
                    google: {
                        oauth2Client: new googleapis_1.google.auth.OAuth2({
                            clientId: '',
                            clientSecret: '',
                            redirectUri: ''
                        }),
                        scopes: ""
                    }
                };
                return providers;
            }
            catch (err) {
                throw err;
            }
        });
    }
    static payment() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paystack = new paystack_sdk_1.Paystack("");
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.Service = Service;
