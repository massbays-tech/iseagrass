import stringify from 'csv-stringify'
import * as admin from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
const cert = JSON.parse(process.env.FIREBASE_CONFIG ?? '{}')
// This stopes the admin from initializing more than 1 time
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cert)
  })
}

const csv = (
  input: stringify.Input,
  options: stringify.Options
): Promise<string> =>
  new Promise((resolve, reject) =>
    stringify(input, options, (err, out) => (err ? reject(err) : resolve(out)))
  )

/**
 * Download CSV file
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ error: `Only HTTP 'GET' is allowed for this endpoint.` })
  }
  const db = admin.firestore()
  const id = req.query.id as string
  const trip = await (await db.collection('trips').doc(id).get()).data()
  if (!trip) {
    return res.status(404).json({ error: `Trip '${id}' not found.` })
  }
  const data = await csv([trip], { header: true })
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=trip.csv')
  res.status(200).send(data)
}
