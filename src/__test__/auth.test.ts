import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import createServer from '../utils/server'
import { v4 as uuidv4 } from 'uuid'
import { createUser } from '../services/auth.service'
import { hashingPassword } from '../utils/hashing'

const app = createServer()

const userAdmin = {
  user_id: uuidv4(),
  email: 'retnotokopedia@gmail.com',
  username: 'retnoadmin',
  password: `${hashingPassword('12345')}`,
  role: 'admin'
}

const userRegular = {
  user_id: uuidv4(),
  email: 'rhezaardiansyah222@gmail.com',
  username: 'rhezaardi',
  password: `${hashingPassword('12345')}`,
  role: 'regular'
}

const userAdminCreated = {
  user_id: uuidv4(),
  email: 'yolashopee1234@gmail.com',
  username: 'yola123',
  password: '12345',
  role: 'admin'
}

const userRegularCreated = {
  user_id: uuidv4(),
  email: 'ardiansyah1234@gmail.com',
  username: 'rhezaardi123',
  password: '12345'
}

const userLogin = {
  email: 'retnotokopedia@gmail.com',
  password: '12345'
}

const userNotExist = {
  email: 'maulana@gmail.com',
  password: '12345'
}

describe('AUTH', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
    await createUser(userAdmin)
    await createUser(userRegular)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('REGISTER', () => {
    describe('CREATE USER WITH ROLE ADMIN', () => {
      it('should return 201, successfully create user admin', async () => {
        await supertest(app).post('/auth/register').send(userAdminCreated).expect(201)
      })
    })
    describe('CREATE USER WITH ROLE REGULAR', () => {
      it('should return 201, successfully create user regular', async () => {
        await supertest(app).post('/auth/register').send(userRegularCreated).expect(201)
      })
    })
  })

  describe('LOGIN', () => {
    describe('SUCCESS LOGIN', () => {
      it('should return 200, success login and return token and refresh token', async () => {
        await supertest(app).post('/auth/login').send(userLogin).expect(200)
      })
    })
    describe('FAILED LOGIN', () => {
      it('should return 422, login failed', async () => {
        await supertest(app).post('/auth/login').send(userNotExist).expect(422)
      })
    })
  })
})
