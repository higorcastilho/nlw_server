"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connections_route_1 = __importDefault(require("./connections.route"));
const classes_route_1 = __importDefault(require("./classes.route"));
const accounts_route_1 = __importDefault(require("./accounts.route"));
const logins_route_1 = __importDefault(require("./logins.route"));
module.exports = {
    connectionsRoutes: connections_route_1.default,
    classesRoutes: classes_route_1.default,
    accountsRoutes: accounts_route_1.default,
    loginsRoutes: logins_route_1.default
};
