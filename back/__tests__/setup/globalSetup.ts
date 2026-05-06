import * as path from 'path'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import { Client } from 'pg'

export default async function globalSetup(): Promise<void> {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
  dotenv.config({ path: path.resolve(__dirname, '../../.env') })

  const baseUrl = process.env.MEMORY_TEST_DATABASE_URL
  if (!baseUrl) {
    throw new Error('MEMORY_TEST_DATABASE_URL is required to run the integration tests')
  }

  const url = new URL(baseUrl)
  const sourceDb = url.pathname.replace(/^\//, '')
  if (!sourceDb) {
    throw new Error('MEMORY_TEST_DATABASE_URL must include a database name in its path')
  }
  const testDb = `${sourceDb}_test`

  const adminUrl = new URL(baseUrl)
  adminUrl.pathname = '/postgres'

  const admin = new Client({ connectionString: adminUrl.toString() })
  await admin.connect()
  try {
    await admin.query(`DROP DATABASE IF EXISTS "${testDb}" WITH (FORCE)`)
    await admin.query(`CREATE DATABASE "${testDb}"`)
  } finally {
    await admin.end()
  }

  const testUrl = new URL(baseUrl)
  testUrl.pathname = `/${testDb}`

  const sqlPath = path.resolve(__dirname, '../../../db/booking_boilerplate.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  const testClient = new Client({ connectionString: testUrl.toString() })
  await testClient.connect()
  try {
    await testClient.query(sql)
  } finally {
    await testClient.end()
  }
}
