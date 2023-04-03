import { Router } from 'express'
import { getUser } from '../controllers/user.controller'

export const UserRouter: Router = Router()

UserRouter.get('/', getUser)
UserRouter.get('/:id', getUser)
