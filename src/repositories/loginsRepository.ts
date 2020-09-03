const JWT = require('jsonwebtoken')
const hash = require('../utils/hash')

import db from '../database/connection'
import crypto from 'crypto'

const { sendMail, verifyTransporter } =   require('../utils/forgotPasswordHandler/index.nodemailer')

const verifyIfEmailExists = async (email: string) => {

	const account = await db('accounts').where('email', email)
	if (!account) false
	if (account) { return account }

}

const login = async (email: string) => await db('accounts').where('email', email)
	

const forgotPassword = async (accountId: number, token: string, now: Date) => {
		await db('accounts')
			.where('id', accountId)
			.update({ password_reset_token: token, password_reset_expires: now })
}

const resetPassword = async (email: string, password: string) => {
		await db('accounts')
			.where('email', email)
			.update({ password })
}

module.exports = {
	login,
	forgotPassword, 
	resetPassword,
	verifyIfEmailExists
}

