import { Req, Res } from 'express'
import db from '../database/connection'

export default class ConnectionsController {
	async index(req: Req, res: Res) {
		const totalConnections = await db('connections').count('* as total')

		const { total } = totalConnections[0]

		return res.json({ total })
	}

	async create(req: Req, res: Res) {
		const { user_id } = req.body

		await db('connections').insert({
			user_id
		})

		return res.status(201).send()
	}
}