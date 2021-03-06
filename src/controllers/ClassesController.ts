import { Request, Response } from 'express'
import convertHourToMinutes from '../utils/convertHourToMinutes'

const ClassesRepository = require('../repositories/classesRepository')

interface ScheduleItem {
	week_day: number
	from: string
	to: string
}

export default class ClassesController {

	async index(req: Request, res: Response) {
		const filters = req.query

		async function paginatedResults() {

			const page = parseInt((req.query as any).page)
			const limit = parseInt((req.query as any).limit)
			const account_id = (req.params as any).account_id

			const startIndex = ( page - 1 ) * limit
			const endIndex = page * limit

			const results = {
				next : {},
				previous: {},
				results: [],
				total: 0
			}

			if (endIndex < 10/*model.length*/) {

				results.next = {
					page: page + 1,
					limit
				}
			}

			if (startIndex > 0) {

				results.previous = {
					page: page - 1,
					limit
				}
			}

			try {

				results.results = await ClassesRepository.paginatedResults(limit, startIndex, account_id)
				
				const allClasses = await ClassesRepository.numOfClasses()
				results.total = allClasses.length.toString()
				
				return results
			} catch (err) {
				res.status(500).json({ message: err.message })
			}
		}

		async function paginatedResultsFilter() {

			const page = parseInt((req.query as any).page)
			const limit = parseInt((req.query as any).limit)

			const startIndex = ( page - 1 ) * limit
			const endIndex = page * limit

			const results = {
				next : {},
				previous: {},
				results: [],
				total: 0
			}

			if (endIndex < 10/*model.length*/) {

				results.next = {
					page: page + 1,
					limit
				}
			}

			if (startIndex > 0) {

				results.previous = {
					page: page - 1,
					limit
				}
			}

			try {

				const timeInMinutes = convertHourToMinutes(filters.time as string)
				results.results = await ClassesRepository.classesFilter(filters.week_day, timeInMinutes, filters.subject, limit, startIndex)
				const allClasses = await ClassesRepository.numOfClassesFilter(filters.week_day, timeInMinutes, filters.subject)
				results.total = allClasses.length.toString()

				return results

			} catch (err) {
				res.status(500).json({ message: err.message })
			}
		}
		if (!filters.week_day || !filters.subject || !filters.time) {
			const paginated = await paginatedResults()
			res.json(paginated)

		} else {
			const paginatedFilter = await paginatedResultsFilter()
			res.json(paginatedFilter) 
		}


	}

	async getClassSchedules(req: Request, res: Response) {

		const classSchedule = await ClassesRepository.getClassSchedules()
		res.json(classSchedule)
	}

	async create(req: Request, res: Response) {

		const { subject, cost, schedule } = req.body
		const { id } = req.params 
		try {
			
			const insertedClassesIds = await ClassesRepository.createClasses(subject, cost, id)
			
			if (insertedClassesIds < 1) {
				throw new Error('Class already exists')
				
			} else {

				const class_id = insertedClassesIds[0]

				const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
					return {
						class_id,
						week_day: scheduleItem.week_day,
						from: convertHourToMinutes(scheduleItem.from),
						to: convertHourToMinutes(scheduleItem.to)
					}
				})

				await ClassesRepository.createClassSchedule(classSchedule)

				return res.status(201).send('Class successfuly created')
			}


		} catch(e) {

			return res.status(400).json({
				error: 'Unexpected error while creating new class: ' + e.message
			})
		}
	}

	async getClassById(req: Request, res: Response) {
		const class_id = req.params.class_id
		const classById = await ClassesRepository.getClassById(class_id)
		res.json(classById)
	}

	async updateClass(req: Request, res: Response) {
		const class_id = req.params.class_id
		const classDetails = req.body
		await ClassesRepository.updateClass(class_id, classDetails)
		res.status(200).send()
		
	}

	async deleteClass(req: Request, res: Response) {
		const class_id = req.params.class_id
		await ClassesRepository.deleteClass(class_id)
		res.status(200).send()
	}

	async deleteScheduleTime(req: Request, res: Response) {
		const { schedule_id } = req.params
		await ClassesRepository.deleteScheduleTime(schedule_id)
		res.status(200).send()
	}
	
}
