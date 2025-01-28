import axios from 'axios';
import { envs } from '../utils/parser'

const instance = axios.create({
  baseURL: envs.SUBTEXT_URI,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + envs.SUBTEXT_API_KEY,
  }
})


export const createSubTextNotification = (async (message: string, vfUserId ? : string) => {
  const data = new URLSearchParams()
  data.append('body', message)
  data.append('recipient_uuid', getRecipientIdFromViafouraId(vfUserId))

  instance.post('/v3/messages', data)
    .then(response => console.log(response.data))
    .catch(error => console.error(error))
})

const getRecipientIdFromViafouraId = (vfUserId?: string) => {
  // TODO: Lookup in a DB
  return '8e6f20a8-c6b7-418c-b59e-ee83ebd1a096'
}
