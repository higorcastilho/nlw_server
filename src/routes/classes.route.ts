import express from 'express'
import ClassesController from '../controllers/ClassesController'
const classesController = new ClassesController()

import verifyJwt from '../utils/verifyJwt'

const routes = express.Router()

routes.get('/classes/:account_id', verifyJwt, classesController.index)
routes.get('/classes-schedules', verifyJwt, classesController.getClassSchedules)
routes.post('/classes/:id', classesController.create)

export default routes