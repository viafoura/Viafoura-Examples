import { logger } from '../utils/logging'
import { version } from '../../package.json'
import { Request, Response } from 'express'
import { IRequest } from '../types'
import { createNotification } from '../providers'
import express from 'express'

const router = express.Router()

router.post('/vf-webhook', (req: Request, res: Response) => {
  logger.info(`Posting webhook request: ${req.method} ${req.url}`);
  const request = req.body as IRequest

  if (Array.isArray(request.notifications)) {
    for (let notification of request.notifications) {
      createNotification(notification)
    }
  }

  return res.send('webhook response')
})

function logCheckProbeMessage(res: Response, checkProbe: string, message: string) : void {
  logger.debug(message)
  logger.silly(`${checkProbe} probe: ${message}, status code: ${res.statusCode}`)
}

router.get('/health-check', (req: Request, res: Response) => {
  logger.info(`Health check request: ${req.method} ${req.url}`);
  const message = 'still alive on ' + version
  logger.info(message)
  return res.send(message)
})

// Liveness probe endpoint
router.get('/liveness', (_req: Request, res: Response) => {
  const message = "It's alive"
  const checkProbe = "Liveness"
  res.status(200).send(message)
  logCheckProbeMessage(res, checkProbe, message)
});

// Readiness probe endpoint
router.get('/readiness', (_req: Request, res: Response) => {
  /**
   * In a real application, you might include checks here to ensure your app
   * can handle requests, e.g., checking DB connections or external service
   * connectivity before responding "It's ready".
   */
  const message = "It's ready"
  const checkProbe = "Readiness"
  res.status(200).send(message)
  logCheckProbeMessage(res, checkProbe, message)
});

export default router
