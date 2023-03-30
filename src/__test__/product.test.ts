import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { addProductToDB } from '../services/product.service'
import createServer from '../utils/server'

const app = createServer()

const productId2 = uuidv4()

const productPayload = {
  product_id: productId2,
  title: 'Nike Vapor',
  price: 3000000,
  size: '41',
  stock: 11,
  category: 'Shoes'
}

describe('product', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
    await addProductToDB(productPayload)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('get all product', () => {
    describe('given the product does exist', () => {
      it('should return 200', async () => {
        const { statusCode } = await supertest(app).get('/product')
        expect(statusCode).toBe(200)
      })
    })
  })

  describe('get detail product', () => {
    describe('given the product does not exist', () => {
      it('should return 404 and empty data', async () => {
        const productId1 = 'PRODUCT_123'
        await supertest(app).get(`/product/${productId1}`).expect(404)
      })
    })
    describe('given the product does exist', () => {
      it('should return 200 and detail product data', async () => {
        const { statusCode, body } = await supertest(app).get(`/product/${productId2}`)
        expect(statusCode).toBe(200)
        expect(body.data.title).toBe('Nike Vapor')
      })
    })
  })
})
