import axios from 'axios'
import { logger } from '../utils/logging'
import { envs } from '../utils/parser'

const instance = axios.create({
  baseURL: envs.ONE_SIGNAL_URI,
  timeout: Number.parseInt(envs.ONE_SIGNAL_TIMEOUT, 10),
})

export const createOneSignalNotification = (async (message: string, vfUserId ?: string) => {
  const notificationObject: any = {
    app_id: process.env.ONE_SIGNAL_APP_ID,
    contents: {
      'en': message
    }
  }

  if (vfUserId) {
    notificationObject.include_aliases = {
      'external_id': [vfUserId]
    }
    notificationObject.target_channel = 'push'
  } else {
    notificationObject.included_segments = ['All']
  }

  const response = await instance.post('/notifications', notificationObject, {
    headers: {
      'Authorization': 'Basic ' + process.env.ONE_SIGNAL_API_KEY
    }
  })
  logger.info(response.data)
  logger.info(response.status)
})
