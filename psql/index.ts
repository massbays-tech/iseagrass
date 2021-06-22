import { Pool } from 'pg'
import { prod } from '../utils'

const ssl = prod
  ? {
      rejectUnauthorized: false
    }
  : undefined
const connectionString = process.env.DATABASE_URL
const pool = new Pool({
  connectionString,
  ssl
})

export const q = (text: string, params: any = []) => pool.query(text, params)

export * from './queries'
