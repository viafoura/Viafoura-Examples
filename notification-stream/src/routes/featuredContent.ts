import express, { Request, Response } from 'express'
import { logger } from '../utils/logging'
import { envs } from '../utils/parser'

const router = express.Router()
let request = require('request')

// Do not do this, this should be stored in a DB or some sort of cache (eg: redis)
let comments: any[] = []

router.post('/vf-content-webhook', async (req: Request, res: Response) => {
  logger.info(`Incoming webhook request: ${req.method} ${req.url}`);
  if (req.body.events) {
    let comment = req.body.events[0]
    try {
      let commentObject = await fetchComment(comment.content_container_uuid, comment.content_uuid)
      comments.push(commentObject)
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Error: ${e.message}`);
      } else {
        logger.error(`Error: ${JSON.stringify(e)}`);
      }
    }
  }

  return res.send('Success')
})

router.get('/vf-featured-content', (req: Request, res: Response) => {
  logger.debug(`Getting Feature Content: ${req.method} ${req.url}`);
  let htmlString = ''
  for (let i = 0; i < comments.length; i++) {
    htmlString = htmlString + '<h1>Featured: ' + comments[i].content + '</h1></br>'
  }
  return res.send(htmlString)
})

function fetchComment(containerUUID: string, contentUUID: string) {
  return new Promise(function(resolve, reject) {
    request.get(envs.LIVE_COMMENTS_URI + envs.SITE_UUID + '/' + containerUUID + '/comments/' + contentUUID + '/single', function(error: any, response: any, body: any) {
      if (body) {
        let jsonObject = JSON.parse(body)
        resolve(jsonObject)
      } else {
        reject(error)
      }
    })
  })
}

export default router
