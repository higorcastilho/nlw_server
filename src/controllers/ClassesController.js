"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const convertHourToMinutes_1 = __importDefault(require("../utils/convertHourToMinutes"));
const ClassesRepository = require('../repositories/classesRepository');
class ClassesController {
    async index(req, res) {
        const filters = req.query;
        async function paginatedResults() {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const account_id = req.params.account_id;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const results = {
                next: {},
                previous: {},
                results: [],
                total: 0
            };
            if (endIndex < 10 /*model.length*/) {
                results.next = {
                    page: page + 1,
                    limit
                };
            }
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit
                };
            }
            try {
                results.results = await ClassesRepository.paginatedResults(limit, startIndex, account_id);
                const allClasses = await ClassesRepository.numOfClasses();
                results.total = allClasses.length.toString();
                return results;
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        }
        async function paginatedResultsFilter() {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const results = {
                next: {},
                previous: {},
                results: [],
                total: 0
            };
            if (endIndex < 10 /*model.length*/) {
                results.next = {
                    page: page + 1,
                    limit
                };
            }
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit
                };
            }
            try {
                const timeInMinutes = convertHourToMinutes_1.default(filters.time);
                results.results = await ClassesRepository.classesFilter(filters.week_day, timeInMinutes, filters.subject, limit, startIndex);
                const allClasses = await ClassesRepository.numOfClassesFilter(filters.week_day, timeInMinutes, filters.subject);
                results.total = allClasses.length.toString();
                return results;
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        }
        if (!filters.week_day || !filters.subject || !filters.time) {
            const paginated = await paginatedResults();
            res.json(paginated);
        }
        else {
            const paginatedFilter = await paginatedResultsFilter();
            res.json(paginatedFilter);
        }
    }
    async getClassSchedules(req, res) {
        const classSchedule = await ClassesRepository.getClassSchedules();
        res.json(classSchedule);
    }
    async create(req, res) {
        const { subject, cost, schedule } = req.body;
        const { id } = req.params;
        try {
            const insertedClassesIds = await ClassesRepository.createClasses(subject, cost, id);
            if (insertedClassesIds < 1) {
                throw new Error('Class already exists');
            }
            else {
                const class_id = insertedClassesIds[0];
                const classSchedule = schedule.map((scheduleItem) => {
                    return {
                        class_id,
                        week_day: scheduleItem.week_day,
                        from: convertHourToMinutes_1.default(scheduleItem.from),
                        to: convertHourToMinutes_1.default(scheduleItem.to)
                    };
                });
                await ClassesRepository.createClassSchedule(classSchedule);
                return res.status(201).send('Class successfuly created');
            }
        }
        catch (e) {
            return res.status(400).json({
                error: 'Unexpected error while creating new class: ' + e.message
            });
        }
    }
    async getClassById(req, res) {
        const class_id = req.params.class_id;
        const classById = await ClassesRepository.getClassById(class_id);
        res.json(classById);
    }
    async updateClass(req, res) {
        const class_id = req.params.class_id;
        const classDetails = req.body;
        await ClassesRepository.updateClass(class_id, classDetails);
        res.status(200).send();
    }
    async deleteClass(req, res) {
        const class_id = req.params.class_id;
        await ClassesRepository.deleteClass(class_id);
        res.status(200).send();
    }
    async deleteScheduleTime(req, res) {
        const { schedule_id } = req.params;
        await ClassesRepository.deleteScheduleTime(schedule_id);
        res.status(200).send();
    }
}
exports.default = ClassesController;
