"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const routes = express_1.default.Router();
exports.default = routes.use(function (req, res, next) {
    const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        jsonwebtoken_1.default.verify(token, 'asasdasdsadf', function (err, decoded) {
            if (err) {
                return res.json({ message: 'Failed to validate token' });
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        return res.status(403).send({
            message: 'Failed to receive a token'
        });
    }
});
