import dotenv from 'dotenv'
import path from 'path'
import { z } from 'zod'

const envConfigPath: string = path.join(__dirname, '..', '.env').toString()

// Load .env file if it exists
dotenv.config({ path: envConfigPath })

/**
 * 1) Define a TypeScript interface for strong typing.
 *    This helps ensure that `env` is typed in the rest of your code.
 */
export interface Environments {
  // App Environment
  ENVIRONMENT: 'local' | 'development' | 'test' | 'production'
  SERVICE: string

  // General
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'
  HTTP_PORT: string
  SITE_DOMAIN: string
  SITE_UUID: string
  LIVE_COMMENTS_URI: string
  SUBTEXT_URI: string

  // Required Sensitive values (e.g., API keys, passwords)
  ONE_SIGNAL_URI: string
  ONE_SIGNAL_TIMEOUT: string
  ONE_SIGNAL_API_KEY: string
  ONE_SIGNAL_APP_ID: string
  SUBTEXT_API_KEY: string
}

/**
 * 2) Mark sensitive keys so they can be masked when logging
 *    (if you want to avoid printing them in logs).
 *    Use unprefixed Names as we have on @interface AppSettings
 */
const SENSITIVE_KEYS: string[] = ['ONE_SIGNAL_API_KEY', 'ONE_SIGNAL_APP_ID', 'SUBTEXT_API_KEY']

/**
 * Define which environment variables you expect and their data types.
 *    Zod helps us ensure the correct shape and type of these variables.
 */
const appSettingSchema = z.object({
  // App Environment
  ENVIRONMENT: z.enum(['local', 'development', 'test', 'production']).default('development'),
  SERVICE: z.string().default('notification-stream'),

  // General
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  HTTP_PORT: z.string().default('3000'),
  SITE_DOMAIN: z.string().default('demo.viafoura.com'),
  SITE_UUID: z.string().default(''),
  LIVE_COMMENTS_URI: z.string().default('https://livecomments.viafoura.co/v4/livecomments/'),
  ONE_SIGNAL_URI: z.string().default('https://onesignal.com/api/v1/notifications'),
  ONE_SIGNAL_TIMEOUT: z.string().default('30000'),
  SUBTEXT_URI: z.string().default('https://joinsubtext.com/'),

  // Required Sensitive values (e.g., API keys, passwords)
  ONE_SIGNAL_API_KEY: z.string().default(''),
  ONE_SIGNAL_APP_ID: z.string().default(''),
  SUBTEXT_API_KEY: z.string().default(''),
})

/**
 * Strip off the "NS_" prefix from *all* environment variable keys
 *    and build a temporary object with unprefixed keys.
 */
function removePrefix(
  source: Record<string, string | undefined>,
  prefix: string
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(source)) {
    if (value !== undefined && key.startsWith(prefix)) {
      const unprefixedKey = key.slice(prefix.length) // remove "NS_"
      result[unprefixedKey] = value
    }
  }
  return result
}

/**
 * Validate and parse the unprefixed object with Zod.
 *    If required variables are missing or invalid, an error is thrown.
 *    Gather only variables that start with NS_ and remove the prefix
 */
const rawEnv = removePrefix(process.env, 'NS_')

/**
 * Gather only variables that start with NS_ and remove the prefix
 */
const parsedEnv = appSettingSchema.parse(rawEnv)

function maskSensitiveData(
  envObject: Record<string, any>,
  keysToMask: string[]
): Record<string, any> {
  return Object.entries(envObject).reduce((acc, [key, value]) => {
    acc[key] = (keysToMask.includes(key) ? (value === '' || value === null ? '' : '*****') : value)
    return acc
  }, {} as Record<string, any>)
}



/**
 * Export a masked version for safe logging
 */
export const maskedEnvs = maskSensitiveData(parsedEnv, SENSITIVE_KEYS)

/**
 * Export the parsedEnv as "env" and type it with the Env interface.
 */
export const envs: Environments = parsedEnv
