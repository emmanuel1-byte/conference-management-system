"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const route_1 = __importDefault(require("./module/authentication/route"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use('/api/v1', route_1.default);
app.get('/', (req, res) => {
    res.status(200).json({ message: 'confrence-management-api is running...' });
});
app.get('*', (req, res) => {
    res.status(400).json({ message: "Endpoint does not exist" });
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ status: 'error', message: "Internal Server Error" });
});
exports.default = app;
