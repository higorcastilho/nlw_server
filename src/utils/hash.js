"use strict";
const bcrypt = require('bcrypt');
const encrypt = async (pass) => {
    const encrypted = bcrypt.hash(pass, 10);
    return encrypted;
};
const compare = async (pass, encrypted) => {
    const checked = bcrypt.compare(pass, encrypted);
    return checked;
};
module.exports = {
    encrypt,
    compare
};
