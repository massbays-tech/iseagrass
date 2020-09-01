import stringify from 'csv-stringify'
import * as admin from 'firebase-admin'
import { compact, mapKeys } from 'lodash'
import { DropFrame, Sample, Trip } from 'models'
import { NextApiRequest, NextApiResponse } from 'next'
const cert = JSON.parse(process.env.FIREBASE_CONFIG ?? '{}')
// This stopes the admin from initializing more than 1 time
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cert)
  })
}

interface DropFrameRow {
  picture?: boolean
  picture_taken_at?: string
  mud?: boolean
  clay?: boolean
  sand?: boolean
  gravel?: boolean
  cobble?: boolean
  coverage?: string
  notes?: string
}

interface SampleShoot {
  length?: string
  width?: string
  disease_coverage?: string
  epiphyte_coverage?: string
}

interface SampleRow {
  units?: string
  picture?: boolean
  picture_taken_at: string
  shoots?: SampleShoot[]
  notes?: string
}

// Row
interface Row {
  // Trip Columns
  boat?: string
  uuid?: string
  crew?: string
  // Station Columns
  station_id?: string
  station_harbor?: string
  station_is_indicator_station?: boolean
  station_notes?: string
  // Weather
  wind?: string
  wind_direction?: string
  sea?: string
  clouds?: string
  tide?: string
  // Location
  longitude?: string
  latitude?: string
  device?: string
  // Secci
  secchi_depth?: string
  secchi_unit?: string
  secchi_time?: string
  secchi_notes?: string
  drop_1_depth?: string
  drop_1_unit?: string
  drop_1_hit_bottom?: boolean
  drop_2_depth?: string
  drop_2_unit?: string
  drop_2_hit_bottom?: boolean

  // Drop Frame
}

const frame = (f: DropFrame, i: number): any =>
  mapKeys(
    {
      picture: f.picture,
      picture_taken_at: f.pictureTakenAt,
      mud: f.sediments.mud,
      clay: f.sediments.clay,
      sand: f.sediments.sand,
      gravel: f.sediments.gravel,
      cobble: f.sediments.cobble,
      coverage: f.coverage,
      notes: f.notes
    },
    (_, k) => `drop_frame_${i}_${k}`
  )

const sample = (s: Sample, i: number): any => {
  const shoots = s.shoots
    .map((shoot, j) => ({
      [`shoot_${j}_length`]: shoot.length,
      [`shoot_${j}_width`]: shoot.width,
      [`shoot_${j}_disease_coverage`]: shoot.diseaseCoverage,
      [`shoot_${j}_epiphyte_coverage`]: shoot.epiphyteCoverage
    }))
    .reduce((all, o) => ({ ...all, ...o }), {})
  const sample = {
    sample_units: s.units,
    sample_picture: s.picture,
    sample_picture_taken_at: s.pictureTakenAt,
    sample_notes: s.notes
  }
  return { ...sample, ...shoots }
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
  const trip = (await (
    await db.collection('trips').doc(id).get()
  ).data()) as any
  if (!trip) {
    return res.status(404).json({ error: `Trip '${id}' not found.` })
  }
  const transformed: Trip = {
    ...trip,
    date: trip.date.toDate()
  }

  console.log('Download', transformed)

  let rows = []
  for (let s of transformed.stations) {
    const { weather, location, secchi } = s
    const frames = s.frames
      .map(frame)
      .reduce((all, o) => ({ ...all, ...o }), {})
    const samples = s.samples
      .map(sample)
      .reduce((all, o) => ({ ...all, ...o }), {})
    let row = {
      boat: trip.boat,
      uuid: trip.uuid,
      crew: compact(trip.crew).join(','),
      station_id: s.stationId,
      station_harbor: s.harbor,
      station_is_indicator_station: s.isIndicatorStation,
      station_notes: s.notes,
      // Weather
      wind: weather.wind,
      wind_direction: weather?.windDirection,
      sea: weather?.sea,
      clouds: weather?.clouds,
      tide: weather?.clouds,
      // Location
      longitude: location?.longitude,
      latitude: location?.latitude,
      device: location?.device,
      // Secci
      secchi_depth: secchi?.depth,
      secchi_unit: secchi?.unit,
      secchi_time: secchi?.time,
      secchi_notes: secchi?.notes,
      ...frames,
      ...samples
    }
    rows.push(row)
  }
  const data = await csv(rows, { header: true })

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=trip.csv')
  res.status(200).send(data)
  //res.status(200).send({})
}
