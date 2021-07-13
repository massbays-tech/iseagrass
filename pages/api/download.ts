import { NextApiRequest, NextApiResponse } from 'next'
import { q, Queries } from 'psql'

interface Query {
  after: string
  before: string
}

const data = (d: any) => d.data()

/**
 * Download the data
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ error: `Only HTTP 'GET' is allowed for this endpoint.` })
  }
  const { after, before } = req.query as unknown as Query

  const params = [new Date(after), new Date(before)]
  const { rows } = await q(Queries.Trips.List, params)
  res.status(201).json(rows)
}
