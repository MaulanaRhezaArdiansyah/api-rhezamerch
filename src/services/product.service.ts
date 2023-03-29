import { logger } from '../utils/logger'
import { productModel } from '../models/product.model'
import ProductType from '../types/product.type'

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

export const addProductToDB = async (payload: ProductType) => {
  return await productModel.create(payload)
}

export const updateProductById = async (id: string, payload: ProductType) => {
  const result = await productModel.findOneAndUpdate(
    {
      product_id: id
    },
    {
      $set: payload
    }
  )
  return result
}

export const deleteProductById = async (id: string) => {
  const result = await productModel.findOneAndDelete({ product_id: id })
  return result
}
