import { Request, Response } from 'express'
import { createSessionValidation, createUserValidation, refreshSessionValidation } from '../validations/auth.validation'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'
import { checkPassword, hashingPassword } from '../utils/hashing'
import { createUser, findUserByEmail } from '../services/auth.service'
import { signJWT, verifyJWT } from '../utils/jwt'

export const registerUser = async (req: Request, res: Response) => {
  req.body.user_id = uuidv4()
  const { error, value } = createUserValidation(req.body)

  if (error) {
    logger.error(`ERROR: auth - register = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    value.password = `${hashingPassword(value.password)}`
    await createUser(value)
    logger.info('SUCCESS: Successfully register user')
    return res.status(201).send({ status: true, statusCode: 201, data: value, message: 'Successfully register user' })
  } catch (error) {
    logger.error(`ERROR: auth - register = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body)

  if (error) {
    logger.info(`ERROR: auth - create session = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const user: any = await findUserByEmail(value.email)
    const isValid: boolean = checkPassword(value.password, user.password)

    if (!isValid) {
      logger.info('ERROR: auth - create session = Invalid email or password')
      return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid email or password' })
    }

    const accessToken = signJWT({ ...user }, { expiresIn: '1d' })
    const refreshToken = signJWT({ ...user }, { expiresIn: '1y' })
    const userData = { ...user }

    return res.status(200).send({
      status: true,
      statusCode: 200,
      data: {
        user: {
          user_id: userData._doc.user_id,
          email: userData._doc.email,
          username: userData._doc.username,
          role: userData._doc.role
        },
        accessToken,
        refreshToken
      },
      message: 'Login success'
    })
  } catch (error) {
    logger.error(`ERROR: auth - create session = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidation(req.body)

  if (error) {
    logger.info(`ERROR: auth - refresh session = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const { decoded } = verifyJWT(value.refreshToken)

    const user = await findUserByEmail(decoded._doc.email)
    if (!user) return false

    const accessToken = signJWT(
      {
        ...user
      },
      { expiresIn: '1d' }
    )

    const userData: any = { ...user }

    return res.status(200).send({
      status: true,
      statusCode: 200,
      data: {
        user: {
          user_id: userData._doc.user_id,
          email: userData._doc.email,
          username: userData._doc.username,
          role: userData._doc.role
        },
        accessToken
      },
      message: 'Refresh session success.'
    })
  } catch (error: any) {
    logger.error(`ERR: auth - refresh session = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}
