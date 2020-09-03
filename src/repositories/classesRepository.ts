import db from '../database/connection'
import convertHourToMinutes from '../utils/convertHourToMinutes'

interface ScheduleItem {
	class_id: number
	week_day: number
	from: string
	to: string
}

const paginatedResults = async ( limit: number, startIndex: number ) => {

		return await db
			.select('*')
			.from('classes')
			.join('accounts', 'classes.account_id', 'accounts.id' )
			.join('users', 'users.account_id', 'accounts.id')
			.limit(limit)
			.offset(startIndex)
}

const getClassSchedules = async () => {
	return await db
		.select('*')
		.from('class_schedule')
}

const numOfClasses = async () => await db.select('*').from('classes')

const classesFilter = async (
	week_day: number, 
	timeInMinutes: number, 
	subject: string, 
	limit: number, 
	startIndex: number
	) => {
		return await db('classes')
			.whereExists(function() {
				this.select('class_schedule.*')
					.from('class_schedule')
					.whereRaw('class_schedule.class_id = classes.id')
					.whereRaw('class_schedule.week_day = ?? ', [Number(week_day)])
					.whereRaw('class_schedule.from <= ?? ', [timeInMinutes])
					.whereRaw('class_schedule.to > ?? ', [timeInMinutes])
			})
			.where('classes.subject', '=', subject)
			.join('accounts', 'classes.account_id', '=', 'accounts.id')
			.join('users', 'users.account_id', '=', 'accounts.id')
			.select(['classes.*', 'users.*'])
			.limit(limit)
			.offset(startIndex)
}

const numOfClassesFilter = async (week_day: number, timeInMinutes: number, subject: string) => {
	return await db
		.select('*')
		.from('classes')
		.whereExists(function() {
			this.select('class_schedule.*')
				.from('class_schedule')
				.whereRaw('class_schedule.class_id = classes.id')
				.whereRaw('class_schedule.week_day = ?? ', [Number(week_day)])
				.whereRaw('class_schedule.from <= ?? ', [timeInMinutes])
				.whereRaw('class_schedule.to > ?? ', [timeInMinutes])
		})
		.where('classes.subject', '=', subject)
}

const createClasses = async (subject: string, cost: number, accountId: number) => {

	return await db('classes').insert({
		subject,
		cost,
		account_id: accountId
	}).returning('classIdPrimary')
}

const createClassSchedule = async (classSchedule: ScheduleItem) => {
	await db('class_schedule').insert(classSchedule).returning('id')
}

module.exports = {
	paginatedResults,
	numOfClasses,
	classesFilter,
	createClasses,
	createClassSchedule,
	numOfClassesFilter,
	getClassSchedules
}
