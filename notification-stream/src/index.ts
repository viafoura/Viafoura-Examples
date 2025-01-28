import express, { NextFunction, Request, Response } from 'express'
import { logger } from './utils/logging'
import { envs, maskedEnvs } from './utils/parser'
import router from './routes'

const app = express()

app.use(express.json())
app.use('/', router)

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  logger.info(`Incoming request: ${req.method} ${req.url}`)
  return res.status(500).send('Something broke!')
})

app.listen(envs.HTTP_PORT, () => {
  logger.debug(JSON.stringify(maskedEnvs))
  logger.info(`App listening on port ${envs.HTTP_PORT}`)
})
