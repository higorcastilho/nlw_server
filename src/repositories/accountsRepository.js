"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
const { hash } = require('../utils/hash');
const index = async (id) => {
    try {
        return await connection_1.default('users')
            .where({ account_id: id })
            .innerJoin('accounts', 'users.account_id', '=', 'accounts.id');
    }
    catch (e) {
        console.log(e);
    }
};
const update = async (id, name, avatar, whatsapp, bio) => {
    try {
        return await connection_1.default('users')
            .where({ account_id: id })
            .update({
            name,
            avatar,
            whatsapp,
            bio
        });
    }
    catch (e) {
        console.log(e);
    }
};
const updateAccountData = async (id, firstName, lastName, email, password) => {
    try {
        return await connection_1.default('accounts')
            .where({ id })
            .update({
            firstName,
            lastName,
            email,
            password
        });
    }
    catch (e) {
        console.log(e);
    }
};
const create = async (firstName, lastName, email, password) => {
    try {
        const account_info = await connection_1.default('accounts').insert({
            firstName,
            lastName,
            email,
            password
        }).returning('id');
        await connection_1.default('users').insert({
            name: 'Nome',
            avatar: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Nerd_with_Glasses_Emoji_2a8485bc-f136-4156-9af6-297d8522d8d1_large.png?v=1571606036',
            whatsapp: '',
            bio: '',
            account_id: account_info[0]
            //account_id: account_info[0] to verify if its necessary
        });
        return 'Account successfuly created';
    }
    catch (e) {
        console.log(e);
    }
};
module.exports = {
    index,
    update,
    updateAccountData,
    create
};
