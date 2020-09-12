"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
const convertHourToMinutes_1 = __importDefault(require("../utils/convertHourToMinutes"));
const paginatedResults = async (limit, startIndex, account_id) => {
    if (account_id > 0) {
        return await connection_1.default
            .select('*')
            .from('classes')
            .where('classes.account_id', '=', account_id)
            .join('accounts', 'classes.account_id', 'accounts.id')
            .join('users', 'users.account_id', 'accounts.id')
            .limit(limit)
            .offset(startIndex);
    }
    return await connection_1.default
        .select('*')
        .from('classes')
        .join('accounts', 'classes.account_id', 'accounts.id')
        .join('users', 'users.account_id', 'accounts.id')
        .limit(limit)
        .offset(startIndex);
};
const getClassSchedules = async () => {
    return await connection_1.default
        .select('*')
        .from('class_schedule');
};
const numOfClasses = async () => await connection_1.default.select('*').from('classes');
const classesFilter = async (week_day, timeInMinutes, subject, limit, startIndex) => {
    return await connection_1.default('classes')
        .whereExists(function () {
        this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('class_schedule.class_id = classes.id_class_primary')
            .whereRaw('class_schedule.week_day = ?? ', [Number(week_day)])
            .whereRaw('class_schedule.from <= ?? ', [timeInMinutes])
            .whereRaw('class_schedule.to > ?? ', [timeInMinutes]);
    })
        .where('classes.subject', '=', subject)
        .join('accounts', 'classes.account_id', '=', 'accounts.id')
        .join('users', 'users.account_id', '=', 'accounts.id')
        .select(['classes.*', 'users.*'])
        .limit(limit)
        .offset(startIndex);
};
const numOfClassesFilter = async (week_day, timeInMinutes, subject) => {
    return await connection_1.default
        .select('*')
        .from('classes')
        .whereExists(function () {
        this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('class_schedule.class_id = classes.id_class_primary')
            .whereRaw('class_schedule.week_day = ?? ', [Number(week_day)])
            .whereRaw('class_schedule.from <= ?? ', [timeInMinutes])
            .whereRaw('class_schedule.to > ?? ', [timeInMinutes]);
    })
        .where('classes.subject', '=', subject);
};
const createClasses = async (subject, cost, accountId) => {
    const existentClasses = await connection_1.default('classes')
        .where('classes.account_id', '=', accountId);
    const creationAuthorized = existentClasses.map(classes => {
        if (classes.subject === subject) {
            return 0;
        }
        return 1;
    });
    if (creationAuthorized.includes(0)) {
        return 0;
    }
    return await connection_1.default('classes').insert({
        subject,
        cost,
        account_id: accountId
    }).returning('id_class_primary');
};
const createClassSchedule = async (classSchedule) => {
    await connection_1.default('class_schedule').insert(classSchedule).returning('id');
};
const getClassById = async (class_id) => {
    const classDetails = await connection_1.default
        .select('*')
        .from('classes')
        .where('id_class_primary', '=', class_id)
        .returning('id_class_primary');
    const schedule = await connection_1.default
        .select('*')
        .from('class_schedule')
        .where('class_id', '=', class_id);
    const classDetailsWithSchedule = Object.assign(Object.assign({}, classDetails[0]), { schedule });
    return classDetailsWithSchedule;
};
const deleteClass = async (class_id) => {
    await connection_1.default('classes')
        .where('id_class_primary', '=', class_id)
        .del();
};
const updateClass = async (class_id, classDetails) => {
    const id_class_primary = await connection_1.default('classes')
        .where({ id_class_primary: class_id })
        .update({
        subject: classDetails.subject,
        cost: classDetails.cost
    }).returning('id_class_primary');
    classDetails.scheduleItems.map(async (schedule) => {
        if (schedule.schedule_id > 0) {
            await connection_1.default('class_schedule')
                .where({ id: schedule.schedule_id })
                .update({
                week_day: schedule.week_day,
                from: convertHourToMinutes_1.default(schedule.from),
                to: convertHourToMinutes_1.default(schedule.to)
            });
        }
        else {
            await connection_1.default('class_schedule')
                .insert({
                week_day: schedule.week_day,
                from: convertHourToMinutes_1.default(schedule.from),
                to: convertHourToMinutes_1.default(schedule.to),
                class_id
            });
        }
        return;
    });
};
const deleteScheduleTime = async (schedule_id) => {
    await connection_1.default('class_schedule')
        .where({ id: schedule_id })
        .del();
};
module.exports = {
    paginatedResults,
    numOfClasses,
    classesFilter,
    createClasses,
    createClassSchedule,
    numOfClassesFilter,
    getClassSchedules,
    getClassById,
    deleteClass,
    updateClass,
    deleteScheduleTime
};
