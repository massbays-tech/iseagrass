import * as admin from 'firebase-admin'
import { mapValues } from 'lodash'
import { Trip } from 'models/index'
import { NextApiRequest, NextApiResponse } from 'next'
const cert = JSON.parse(process.env.FIREBASE_CONFIG ?? '{}')
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cert)
  })
}

const convert = (o: any, keys: Set<string>): any =>
  mapValues(o, (v, k) => (keys.has(k) ? parseFloat(v) : v))

/**
 * Upload the collected data to the server
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: `Only HTTP 'POST' is allowed for this endpoint.` })
  }
  const db = admin.firestore()
  const trip: Trip = req.body
  const converted = convert(trip, new Set())
  converted.date = new Date(converted.date)
  await db.collection('trips').doc(converted.uuid).set(converted)

  //const snapshot = await db.collection('trips').where('date', '>', new Date()).where()

  res.status(200).json({ upload: 'success' })
}
