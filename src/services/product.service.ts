import { logger } from '../utils/logger'
import { productModel } from '../models/product.model'
// import ProductType from "../types/product.type";

export const getProductFromDB = async () => {
  return await productModel
    .find()
    .then((result: any) => {
      return result
    })
    .catch((error: any) => {
      logger.info('Cannot get data from DB')
      logger.error(error)
    })
}
