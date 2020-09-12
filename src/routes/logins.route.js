"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LoginsController_1 = __importDefault(require("../controllers/LoginsController"));
const loginsController = new LoginsController_1.default();
const routes = express_1.default.Router();
routes.post('/login', loginsController.login);
routes.post('/forgot-password', loginsController.forgotPassword);
routes.put('/reset-password', loginsController.resetPassword);
routes.post('/change-password', loginsController.changePassword);
exports.default = routes;
