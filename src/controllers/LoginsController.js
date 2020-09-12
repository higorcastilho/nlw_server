"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hash = require('../utils/hash');
const crypto_1 = __importDefault(require("crypto"));
const { sendMail, verifyTransporter } = require('../utils/forgotPasswordHandler/index.nodemailer');
const LoginsRepository = require('../repositories/loginsRepository');
class LoginsController {
    async login(req, res) {
        const { email, password } = req.body;
        const userData = await LoginsRepository.login(email);
        const passwordOk = await hash.compare(password, userData[0].password);
        if (!passwordOk) {
            //throw new Error('Senha inválida');
            console.log('Senha inválida');
            res.json({ 'error': 'Senha inválida' });
        }
        const generate = await new Promise(resolve => {
            jsonwebtoken_1.default.sign({
                exp: Math.floor(Date.now() / 1000) + 6000000000,
                sub: userData[0].id,
                iss: 'sqlite-3',
                data: {
                    user_id: userData[0].ids
                },
            }, 'asasdasdsadf', { algorithm: 'HS256' }, (err, token) => {
                if (err) {
                    console.log(err);
                }
                resolve(token);
            });
        });
        res.json({ "type": "bearer", "token": generate });
    }
    async forgotPassword(req, res) {
        const { email } = req.body;
        try {
            const account = await LoginsRepository.verifyIfEmailExists(email);
            if (!account) {
                return res.status(400).send({ error: 'User not found' });
            }
            const token = crypto_1.default.randomBytes(20).toString('hex');
            const now = new Date();
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            now.toLocaleDateString('pt-BR', options);
            now.setHours(now.getHours() + 1);
            await LoginsRepository.forgotPassword(account[0].id, token, now);
            sendMail(email, token);
            res.send();
        }
        catch (err) {
            res.status(400).send({ error: 'Error on forgot password. Please, try again.' });
        }
    }
    async resetPassword(req, res) {
        const { email, password, token } = req.body;
        try {
            const account = await LoginsRepository.verifyIfEmailExists(email);
            if (!account) {
                return res.status(400).send({ error: 'User not found' });
            }
            if (account[0].password_reset_token !== token) {
                return res.status(400).send({ error: 'Invalid token.' });
            }
            const now = new Date();
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            now.toLocaleDateString('pt-BR', options);
            if (now > account[0].password_reset_expires) {
                return res.status(400).send({ error: 'Token expired.' });
            }
            const hashedPassword = await hash.encrypt(password);
            await LoginsRepository.resetPassword(email, hashedPassword);
            res.send();
        }
        catch (err) {
            res.status(400).send({ error: 'Invalid link. Please, try get a new email link.' });
        }
    }
    async changePassword(req, res) {
        const { email, currentPassword, newPassword } = req.body;
        try {
            const userData = await LoginsRepository.login(email);
            const passwordOk = await hash.compare(currentPassword, userData[0].password);
            if (!passwordOk) {
                console.log('Senha inválida');
                res.json({ 'error': 'Senha inválida' });
            }
            const hashedPassword = await hash.encrypt(newPassword);
            await LoginsRepository.resetPassword(email, hashedPassword);
            res.send();
        }
        catch (e) {
            console.log(e.message);
        }
    }
}
exports.default = LoginsController;
