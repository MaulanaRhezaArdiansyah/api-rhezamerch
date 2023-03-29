import Joi from 'joi'
import ProductType from '../types/product.type'

export const createProductValidation = (payload: ProductType) => {
  const schema = Joi.object({
    product_id: Joi.string().required(),
    title: Joi.string().required(),
    price: Joi.number().required(),
    size: Joi.string().required(),
    stock: Joi.number().required(),
    category: Joi.string().required(),
    image: Joi.string().required()
  })
  return schema.validate(payload)
}

export const updateProductValidation = (payload: ProductType) => {
  const schema = Joi.object({
    title: Joi.string().allow('', null),
    price: Joi.number().allow('', null),
    size: Joi.string().allow('', null),
    stock: Joi.number().allow('', null),
    category: Joi.string().allow('', null),
    image: Joi.string().allow('', null)
  })
  return schema.validate(payload)
}
