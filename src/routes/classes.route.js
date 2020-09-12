"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ClassesController_1 = __importDefault(require("../controllers/ClassesController"));
const classesController = new ClassesController_1.default();
const verifyJwt_1 = __importDefault(require("../utils/verifyJwt"));
const routes = express_1.default.Router();
routes.get('/classes/:account_id', verifyJwt_1.default, classesController.index);
routes.get('/classes-schedules', verifyJwt_1.default, classesController.getClassSchedules);
routes.get('/class-by-id/:class_id', verifyJwt_1.default, classesController.getClassById);
routes.delete('/class-by-id/:class_id', verifyJwt_1.default, classesController.deleteClass);
routes.delete('/remove-schedule-time/:schedule_id', verifyJwt_1.default, classesController.deleteScheduleTime);
routes.post('/classes/:id', classesController.create);
routes.put('/classes-update/:class_id', classesController.updateClass);
exports.default = routes;
