"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ConnectionsController_1 = __importDefault(require("../controllers/ConnectionsController"));
const connectionsController = new ConnectionsController_1.default();
const routes = express_1.default.Router();
routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);
exports.default = routes;
