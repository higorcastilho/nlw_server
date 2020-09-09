import db from '../database/connection'
import convertHourToMinutes from '../utils/convertHourToMinutes'

interface ScheduleItem {
	class_id?: number
	schedule_id?: number
	week_day: number
	from: string
	to: string
}

const paginatedResults = async ( limit: number, startIndex: number, account_id: number ) => {

	if (account_id > 0) {
		return await db
			.select('*')
			.from('classes')
			.where('classes.account_id', '=', account_id)
			.join('accounts', 'classes.account_id', 'accounts.id' )
			.join('users', 'users.account_id', 'accounts.id')
			.limit(limit)
			.offset(startIndex)		
	}

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
					.whereRaw('class_schedule.class_id = classes.id_class_primary')
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
				.whereRaw('class_schedule.class_id = classes.id_class_primary')
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
	}).returning('id_class_primary')
}

const createClassSchedule = async (classSchedule: ScheduleItem) => {
	await db('class_schedule').insert(classSchedule).returning('id')
}

const getClassById = async (class_id: number) => {
	const classDetails = await db
		.select('*')
		.from('classes')
		.where('id_class_primary', '=', class_id)
		.returning('id_class_primary')
	
	const schedule = await db
		.select('*')
		.from('class_schedule')
		.where('class_id', '=', class_id)

	const classDetailsWithSchedule = {
		...classDetails[0],
		schedule
	}

	return classDetailsWithSchedule
}

const deleteClass = async (class_id: number) => {
	await db('classes')
		.where('id_class_primary', '=', class_id)
		.del()
}

const updateClass = async (class_id: number, classDetails: any ) => {
	
	const id_class_primary = await db('classes')
		.where({ id_class_primary: class_id })
		.update({
			subject: classDetails.subject,
			cost: classDetails.cost
	}).returning('id_class_primary')

	classDetails.scheduleItems.map( async (schedule: ScheduleItem )  => {
		await db('class_schedule')
			.where({ id: schedule.schedule_id })
			.update({
				week_day: schedule.week_day,
				from: convertHourToMinutes(schedule.from),
				to: convertHourToMinutes(schedule.to)
			})
		return 
	})
}

const deleteScheduleTime = async (schedule_id: number) => {
	await db('class_schedule')
		.where({ id: schedule_id })
		.del()
}

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
}
