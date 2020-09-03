import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import express from 'express'

const routes = express.Router()

export default routes.use(function(req: Request, res: Response, next: NextFunction) {

	const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token']
	if (token) {
		jwt.verify(token, 'asasdasdsadf', function(err: any, decoded: any) {
			if(err) {
				return res.json({ message: 'Failed to validate token' })
			} else {
				(req as any).decoded = decoded
				next()
			}
		})
	} else {
		return res.status(403).send({
			message: 'Failed to receive a token'
		})
	}
})