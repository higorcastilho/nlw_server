const hash = require('../utils/hash')
import { Request, Response } from 'express'
const AccountsRepository = require('../repositories/accountsRepository')

export default class AccountsController {

	async index(req: Request, res: Response) {
		try {
			const userInfo = await AccountsRepository.index(req.params.id)
	
			const {
				id, 
				name, 
				avatar, 
				whatsapp, 
				bio, 
				account_id, 
				firstName, 
				lastName, 
				email } = userInfo[0]

			res.json({
				"data": [{
					"type": "users",
					"id": id,
					"attributes": {
						"name": name,
						"avatar": avatar,
						"whatsapp": whatsapp,
						"bio": bio,
						"account_id": account_id,
						"firstName": firstName,
						"lastName": lastName,
						"email": email
					}
				}]
			})

		} catch (e) {
			console.log(e)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params
			const { name, avatar, whatsapp, bio } = req.body

			const userUpdated = await AccountsRepository.update( 
				id, 
				name,
				avatar,
				whatsapp,
				bio 
			)

			res.json(userUpdated)

		} catch (e) {
			console.log(e)
		}
	}

	async updateAccountData(req: Request, res: Response) {
		try {

			const { id } = req.params
			const { firstName, lastName, email } = req.body
			

			const userUpdated = await AccountsRepository.updateAccountData(
				id,
				firstName,
				lastName,
				email
			)

			res.json(userUpdated)

		} catch (e) {
			console.log(e)
		}
	}

	async create(req: Request, res: Response) {
		try {
			const { firstName, lastName, email, password } = req.body

			const hashedPassword = await hash.encrypt(password)

			const account_info = await AccountsRepository.create(
				firstName,
				lastName,
				email,
				hashedPassword
			)

			return res.status(201).send('Account successfuly created')

		} catch (e) {
			console.log(e)
		}

	}
}