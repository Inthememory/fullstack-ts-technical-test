import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const baseUrl = process.env.MEMORY_TEST_DATABASE_URL
if (!baseUrl) {
  throw new Error(
    'MEMORY_TEST_DATABASE_URL is required to run the integration tests. ' +
      'Run them inside the docker backend container, or export it pointing at a reachable Postgres.'
  )
}

const url = new URL(baseUrl)
const sourceDb = url.pathname.replace(/^\//, '')
if (!sourceDb) {
  throw new Error('MEMORY_TEST_DATABASE_URL must include a database name in its path')
}

url.pathname = `/${sourceDb}_test`
process.env.MEMORY_TEST_DATABASE_URL = url.toString()
