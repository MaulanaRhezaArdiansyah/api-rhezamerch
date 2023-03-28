import express, { Application, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import { routes } from './routes'
import cors from 'cors'
import './utils/connectDB'

const app: Application = express()
const port: number = 9000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

routes(app)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
