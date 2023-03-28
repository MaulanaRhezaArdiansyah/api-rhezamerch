import { Request, Response } from 'express'
import { logger } from '../utils/logger'
import { getProductFromDB } from '../services/product.service'

export const getProduct = async (req: Request, res: Response) => {
  try {
    const products: unknown = await getProductFromDB()
    logger.info('Succesfully get all product data.')
    return res.status(200).send({
      status: true,
      statusCode: 200,
      data: products,
      message: 'Succesfully get all product data.'
    })
  } catch (error) {
    logger.error(error)
  }
}
