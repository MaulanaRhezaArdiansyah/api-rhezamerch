import { Router } from 'express'
import { upload } from '../middlewares/multer'
import { createProduct, deleteProduct, getProduct, updateProduct } from '../controllers/product.controller'
// import { requireAdmin } from '../middlewares/auth'

export const ProductRouter: Router = Router()

ProductRouter.get('/', getProduct)
ProductRouter.get('/:id', getProduct)
// ProductRouter.post('/', requireAdmin, upload, createProduct) sementara dinonaktifkan dulu
ProductRouter.post('/', upload, createProduct)
// ProductRouter.put('/:id', requireAdmin, upload, updateProduct)
ProductRouter.put('/:id', upload, updateProduct)
// ProductRouter.patch('/:id', upload, updateProduct)
// ProductRouter.delete('/:id', requireAdmin, deleteProduct)
ProductRouter.delete('/:id', deleteProduct)
