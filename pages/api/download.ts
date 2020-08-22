import * as admin from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
console.log('BIG TEST', process.env.FIREBASE_CONFIG)
const cert = JSON.parse(process.env.FIREBASE_CONFIG ?? '{}')
// This stopes the admin from initializing more than 1 time
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cert)
  })
}

interface Query {
  after: string
  before: string
}

/**
 * Download the data
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ error: `Only HTTP 'GET' is allowed for this endpoint.` })
  }
  const db = admin.firestore()
  const { after, before } = (req.query as unknown) as Query
  const query = await db
    .collection('trips')
    .where('date', '>=', new Date(after))
    .where('date', '<=', new Date(before))
    .get()
  res.status(200).json(query.docs.map((d) => d.data()))
}
