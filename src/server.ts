import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const { PORT } = process.env

const { 

	connectionsRoutes, 
	classesRoutes, 
	accountsRoutes,
	loginsRoutes 

} = require('./routes/index')

app.use(connectionsRoutes)
app.use(classesRoutes)
app.use(accountsRoutes)
app.use(loginsRoutes)

app.listen(PORT || 3333, () => {
	console.log('Running on port 3333')
})