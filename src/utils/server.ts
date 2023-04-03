import express, { Application, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { routes } from '../routes'
import deserializeUser from '../middlewares/deserializedUser'

const createServer = () => {
  const app: Application = express()
  app.use(cors())
  app.use(deserializeUser)
  app.use(express.static('public/uploads'))

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
  })

  routes(app)

  return app
}

export default createServer
