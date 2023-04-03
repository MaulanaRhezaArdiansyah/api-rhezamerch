import { logger } from './utils/logger'
import createServer from './utils/server'
import './utils/connectDB'

const app = createServer()
const port = process.env.PORT ?? 9000

app.listen(port, () => {
  logger.info(`Server is listening on port ${port}`)
})
