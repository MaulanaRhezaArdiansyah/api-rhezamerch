import { productModel } from '../models/product.model'
// import ProductType from "../types/product.type";

export const getProductFromDB = async () => {
  return await productModel
    .find()
    .then((result) => {
      console.log(result)
      return result
    })
    .catch((error) => {
      console.log('Cannot get data from DB')
      console.log(error)
    })
}
