"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AccountsController_1 = __importDefault(require("../controllers/AccountsController"));
const accountsController = new AccountsController_1.default();
const routes = express_1.default.Router();
routes.post('/accounts', accountsController.create);
routes.put('/accounts-user/:id', accountsController.update);
routes.put('/accounts/:id', accountsController.updateAccountData);
routes.get('/accounts/:id', accountsController.index);
exports.default = routes;
