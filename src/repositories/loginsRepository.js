"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JWT = require('jsonwebtoken');
const hash = require('../utils/hash');
const connection_1 = __importDefault(require("../database/connection"));
const { sendMail, verifyTransporter } = require('../utils/forgotPasswordHandler/index.nodemailer');
const verifyIfEmailExists = async (email) => {
    const account = await connection_1.default('accounts').where('email', email);
    if (!account)
        false;
    if (account) {
        return account;
    }
};
const login = async (email) => await connection_1.default('accounts').where('email', email);
const forgotPassword = async (accountId, token, now) => {
    await connection_1.default('accounts')
        .where('id', accountId)
        .update({ password_reset_token: token, password_reset_expires: now });
};
const resetPassword = async (email, password) => {
    await connection_1.default('accounts')
        .where('email', email)
        .update({ password });
};
module.exports = {
    login,
    forgotPassword,
    resetPassword,
    verifyIfEmailExists
};
