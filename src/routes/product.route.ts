import { Router } from 'express'
import { upload } from '../middlewares/multer'
import { createProduct, deleteProduct, getProduct, updateProduct } from '../controllers/product.controller'

export const ProductRouter: Router = Router()

ProductRouter.get('/', getProduct)
ProductRouter.get('/:id', getProduct)
ProductRouter.post('/', upload, createProduct)
ProductRouter.put('/:id', upload, updateProduct)
ProductRouter.delete('/:id', deleteProduct)
