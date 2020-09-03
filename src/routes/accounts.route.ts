import express from 'express'
import AccountsController from '../controllers/AccountsController'
const accountsController = new AccountsController()

const routes = express.Router()

routes.post('/accounts', accountsController.create)
routes.post('/accounts-user/:id', accountsController.update)
routes.post('/accounts/:id', accountsController.updateAccountData)
routes.get('/accounts/:id', accountsController.index)

export default routes

