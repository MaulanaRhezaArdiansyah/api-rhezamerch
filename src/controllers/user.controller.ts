import { Request, Response } from 'express'
import { getUserById, getUserFromDB } from '../services/user.service'
import { logger } from '../utils/logger'

export const getUser = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req

  if (id) {
    const user = await getUserById(id)
    if (!user) {
      logger.info('User not found')
      return res.status(404).send({ status: false, statusCode: 404, message: 'User not found' })
    }
  }

  try {
    const users = await getUserFromDB()
    logger.info('Successfully get all users data')
    return res
      .status(200)
      .send({ status: true, statusCode: 200, data: users, message: 'Successfully get all users data' })
  } catch (error) {
    logger.error(error)
    return res.status(500).send({ status: false, statusCode: 500, message: error })
  }
}
