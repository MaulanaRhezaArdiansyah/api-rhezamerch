import { Request, Response } from 'express'
import { logger } from '../utils/logger'
import {
  addProductToDB,
  deleteProductById,
  getProductById,
  getProductFromDB,
  updateProductById
} from '../services/product.service'
import { v4 as uuidv4 } from 'uuid'
import { createProductValidation, updateProductValidation } from '../validations/product.validation'

export const getProduct = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req

  if (id) {
    const product = await getProductById(id)
    if (!product) {
      logger.info('Product not found')
      return res.status(404).send({ status: false, statusCode: 404, data: {}, message: 'Product not found!' })
    } else {
      logger.info('Successfully get detail product')
      return res.status(200).send({
        status: true,
        statusCode: 200,
        data: product,
        message: 'Successfully get detail product'
      })
    }
  }

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

export const createProduct = async (req: Request, res: Response) => {
  req.body.product_id = uuidv4()
  const { error, value } = createProductValidation(req.body)

  if (error) {
    logger.error(`ERROR: product - create = ${error?.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error?.details[0].message })
  }

  try {
    await addProductToDB(value)
    logger.info('Successfully add new product')
    return res.status(201).send({ status: true, statusCode: 201, data: value, message: 'Successfully add new product' })
  } catch (error) {
    logger.error(`ERROR: product - create = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req

  const { error, value } = updateProductValidation(req.body)

  if (error) {
    logger.error(`ERROR: product - update = ${error?.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error?.details[0].message })
  }

  try {
    const result = await updateProductById(id, value)
    if (!result) {
      logger.info('Product not found')
      return res.status(404).send({ status: false, statusCode: 404, message: 'Product not found' })
    }
    logger.info('Successfully update product')
    return res.status(200).send({ status: true, statusCode: 200, data: value, message: 'Successfully update product' })
  } catch (error) {
    logger.error(`ERROR: product - create = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req

  try {
    const result = await deleteProductById(id)
    if (!result) {
      logger.info('Product not found')
      return res.status(404).send({ status: false, statusCode: 404, message: 'Product not found' })
    }
    logger.info('Successfully delete product')
    return res.status(200).send({ status: true, statusCode: 200, message: 'Successfully delete product' })
  } catch (error) {
    logger.error(`ERROR: product - delete = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}
