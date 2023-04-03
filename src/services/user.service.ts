import { logger } from '../utils/logger'
import userModel from '../models/user.model'

export const getUserFromDB = async () => {
  return await userModel
    .find()
    .then((result: any) => {
      return result
    })
    .catch((error: any) => {
      logger.info('Cannot get user data from DB')
      logger.error(error)
    })
}

export const getUserById = async (id: string | undefined) => {
  return await userModel.findOne({ product_id: id })
}
