import { compact } from 'lodash'
import { Trip } from 'models/index'
import { NextApiRequest, NextApiResponse } from 'next'
import { q, Queries } from 'psql'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: `Only HTTP 'POST' is allowed for this endpoint.` })
  }
  let { uuid, date, boat, crew, stations } = req.body as Trip
  //const converted = convert(trip, new Set())
  //trip.date = new Date(trip.date)
  const uploadedAt = new Date()
  stations = (stations ?? []).map((s) => {
    const station = { ...s }
    delete station['$ui']
    return station
  })
  const params = [
    uuid,
    date,
    boat,
    JSON.stringify(compact(crew)),
    JSON.stringify(stations),
    uploadedAt
  ]
  const { rows } = await q(Queries.Trips.Upsert, params)
  res.status(201).json(rows[0])
}
