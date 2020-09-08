import express from 'express'
import ClassesController from '../controllers/ClassesController'
const classesController = new ClassesController()

import verifyJwt from '../utils/verifyJwt'

const routes = express.Router()

routes.get('/classes/:account_id', verifyJwt, classesController.index)
routes.get('/classes-schedules', verifyJwt, classesController.getClassSchedules)
routes.get('/class-by-id/:class_id', verifyJwt, classesController.getClassById)
routes.delete('/class-by-id/:class_id', verifyJwt, classesController.deleteClass)
routes.post('/classes/:id', classesController.create)
routes.post('/classes-update/:class_id', classesController.updateClass)

export default routes