import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { addProductToDB } from '../services/product.service'
import createServer from '../utils/server'
import { hashingPassword } from '../utils/hashing'
import { createUser } from '../services/auth.service'

const app = createServer()

const productId2 = uuidv4()

const productPayload = {
  product_id: productId2,
  title: 'Nike Vapor',
  price: 3000000,
  size: '41',
  stock: 11,
  category: 'Shoes',
  image: 'asdasd.jpg'
}

const productPayloadCreate = {
  product_id: uuidv4(),
  title: 'Nike Vapor 5',
  price: 100000,
  size: '5',
  stock: 21,
  category: 'Ball'
}

const productPayloadUpdate = {
  title: 'Nike Vapor',
  price: 3000000
}

const userAdmin = {
  email: 'retnotokopedia@gmail.com',
  password: '12345'
}

const userRegular = {
  email: 'rhezaardiansyah222@gmail.com',
  password: '12345'
}

const userAdminCreated = {
  user_id: uuidv4(),
  email: 'retnotokopedia@gmail.com',
  username: 'retnoadmin',
  password: `${hashingPassword('12345')}`,
  role: 'admin'
}

const userRegularCreated = {
  user_id: uuidv4(),
  email: 'rhezaardiansyah222@gmail.com',
  username: 'rhezaardi',
  password: `${hashingPassword('12345')}`,
  role: 'regular'
}

describe('PRODUCT', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
    await addProductToDB(productPayload)
    await createUser(userAdminCreated)
    await createUser(userRegularCreated)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('GET ALL PRODUCT', () => {
    describe('given the product does exist', () => {
      it('should return 200', async () => {
        const { statusCode } = await supertest(app).get('/product')
        expect(statusCode).toBe(200)
      })
    })
  })

  describe('GET DETAIL PRODUCT', () => {
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

  describe('CREATE PRODUCT', () => {
    describe('if user not login', () => {
      it('should return 403, request forbidden', async () => {
        const { statusCode } = await supertest(app).post('/product').send(productPayloadCreate)
        expect(statusCode).toBe(403)
      })
    })
    describe('if user login as admin', () => {
      it('should return 201, successfully create product', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        await supertest(app)
          .post('/product')
          .set('Authorization', `Bearer ${body.data.token}`)
          .send(productPayloadCreate)
        expect(201)
      })
      it('should return 422, product title is already exist in db', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        await supertest(app)
          .post('/product')
          .set('Authorization', `Bearer ${body.data.token}`)
          .send(productPayloadCreate)
        expect(422)
      })
    })
    describe('if user login as regular', () => {
      it('should return 403, request forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const { statusCode } = await supertest(app)
          .post('/product')
          .set('Authorization', `Bearer ${body.data.token}`)
          .send(productPayloadCreate)
        expect(statusCode).toBe(403)
      })
    })
  })

  describe('UPDATE PRODUCT', () => {
    describe('if user not login', () => {
      it('should return 403, request forbidden', async () => {
        const { statusCode } = await supertest(app).put(`/product/${productPayload.product_id}`)
        expect(statusCode).toBe(403)
      })
    })
    describe('if user login as admin', () => {
      it('should return 200, successfully update product', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        await supertest(app)
          .put(`/product/${productPayload.product_id}`)
          .set('Authorization', `Bearer ${body.data.token}`)
          .send(productPayloadUpdate)
        expect(200)

        const updatedData = await supertest(app).get(`/product/${productPayload.product_id}`)
        expect(updatedData.body.data.title).toBe('Nike Vapor')
        expect(updatedData.body.data.price).toBe(3000000)
      })
      it('should return 404, product does not found in db', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        await supertest(app)
          .put('/product/product_123')
          .set('Authorization', `Bearer ${body.data.token}`)
          .send(productPayloadUpdate)
        expect(404)
      })
    })
    describe('if user login as regular', () => {
      it('should return 403, request forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const { statusCode } = await supertest(app)
          .put(`/product/${productPayload.product_id}`)
          .set('Authorization', `Bearer ${body.data.token}`)
          .send(productPayloadUpdate)
        expect(statusCode).toBe(403)
      })
    })
  })

  describe('DELETE PRODUCT', () => {
    describe('if user not login', () => {
      it('should return 403, request forbidden', async () => {
        const { statusCode } = await supertest(app).delete(`/product/${productPayload.product_id}`)
        expect(statusCode).toBe(403)
      })
    })
    describe('if user login as admin', () => {
      it('should return 200, successfully delete product', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        await supertest(app)
          .delete(`/product/${productPayload.product_id}`)
          .set('Authorization', `Bearer ${body.data.token}`)
        expect(200)
      })
      it('should return 404, product does not found in db', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        await supertest(app).delete('/product/product_123').set('Authorization', `Bearer ${body.data.token}`)
        expect(404)
      })
    })
    describe('if user login as regular', () => {
      it('should return 403, request forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const { statusCode } = await supertest(app)
          .delete(`/product/${productPayload.product_id}`)
          .set('Authorization', `Bearer ${body.data.token}`)
        expect(statusCode).toBe(403)
      })
    })
  })
})
