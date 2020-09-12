"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
const { connectionsRoutes, classesRoutes, accountsRoutes, loginsRoutes } = require('./routes/index');
app.use(connectionsRoutes);
app.use(classesRoutes);
app.use(accountsRoutes);
app.use(loginsRoutes);
app.listen(process.env.PORT || 3333, () => {
    console.log('Running on port 3333');
});
