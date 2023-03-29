import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      unique: true
    },
    title: {
      type: String
    },
    price: {
      type: Number
    },
    size: {
      type: String
    },
    stock: {
      type: Number
    },
    category: {
      type: String
    }
  },
  { timestamps: true }
)

export const productModel = mongoose.model('product', productSchema)
