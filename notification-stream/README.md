# Notification Stream

## New NPM Commands

```json
{
  "start": "npx tsx src/index.ts",
  "test": "echo \"Error: no test specified\" && exit 1",
  "build-local": "tsc --build --clean && ncc build --source-map --license LICENSE --out dist-local src/index.ts",
  "build-local-and-watch": "tsc --build --clean && ncc build ---source-map --watch --license LICENSE --out dist-local src/index.ts",
  "build": "tsc --build --clean && ncc build --source-map --license LICENSE src/index.ts",
  "format": "prettier --write **/*.ts",
  "format-check": "prettier --check **/*.ts",
  "lint": "eslint **/*.ts",
  "package": "ncc build --source-map --license LICENSE",
  "dkr-build-local": "docker buildx build --progress plain --pull --rm -f \"Dockerfile.local\" -t notification-stream:latest \".\"",
  "dkr-compose-local-up": "docker compose --env-file .env -f docker-compose.yaml -f docker-compose.local.yaml up --build",
  "dkr-compose-local-down": "docker compose --env-file .env -f docker-compose.yaml -f docker-compose.local.yaml down"
}
```

To run the commands above you need to execute `npm run build-local`:

## Application Settings

New environment variables needs to be added into [parser.ts](./src/utils/parser.ts)

```typescript
/**
 * 1) Define a TypeScript interface for strong typing.
 *    This helps ensure that `env` is typed in the rest of your code.
 */
export interface AppConfig {
  // App Environment
  ENVIRONMENT: 'local' | 'development' | 'test' | 'production'
  SERVICE: string

  // General
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'
  HTTP_PORT: string
  SITE_DOMAIN: string
  SITE_UUID: string
  LIVE_COMMENTS_URI: string

  // Required Sensitive values (e.g., API keys, passwords)
  ONE_SIGNAL_URI: string
  ONE_SIGNAL_TIMEOUT: number
  ONE_SIGNAL_API_KEY: string
  ONE_SIGNAL_APP_ID: string
  SUBTEXT_API_KEY: string
}
```

To omit some environment variables into logs you can add the sensitive keys into `SENSITIVE_KEYS` list:

```typescript
/**
 * 2) Mark sensitive keys so they can be masked when logging
 *    (if you want to avoid printing them in logs).
 *    Use unprefixed Names as we have on @interface AppSettings
 */
const SENSITIVE_KEYS: string[] = ['ONE_SIGNAL_API_KEY', 'ONE_SIGNAL_APP_ID', 'SUBTEXT_API_KEY']
```

To output the AppSettings Keys in logs, please, use `maskSensitiveData`, that contains the sensitive data masked.
