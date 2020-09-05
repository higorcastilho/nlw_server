import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

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

app.listen(process.env.PORT || 3333, () => {
	console.log('Running on port 3333')
})