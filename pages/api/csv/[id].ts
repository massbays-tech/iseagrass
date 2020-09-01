import stringify from 'csv-stringify'
import * as admin from 'firebase-admin'
import { compact, flatten, range } from 'lodash'
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

const frame = (f: DropFrame, i: number): any => ({
  drop_frame: i,
  drop_frame_picture: f.picture,
  drop_frame_picture_taken_at: f.pictureTakenAt,
  drop_frame_mud: f.sediments.mud,
  drop_frame_clay: f.sediments.clay,
  drop_frame_sand: f.sediments.sand,
  drop_frame_gravel: f.sediments.gravel,
  drop_frame_cobble: f.sediments.cobble,
  drop_frame_coverage: f.coverage,
  drop_frame_notes: f.notes
})

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

const cols = ['length', 'width', 'disease_coverage', 'epiphyte_coverage']
const sampleColumns = (i: number) =>
  flatten(range(i).map((j) => cols.map((c) => `shoot_${j}_${c}`))).reduce(
    (map, c) => ({ ...map, [c]: undefined }),
    {}
  )

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

  let rows = []
  for (let s of transformed.stations) {
    const { weather, location, secchi } = s
    const frames = s.frames.map(frame)
    const samples = s.samples.map(sample)
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
      // Drop Frame
      drop_frame: undefined,
      drop_frame_picture: undefined,
      drop_frame_picture_taken_at: undefined,
      drop_frame_mud: undefined,
      drop_frame_clay: undefined,
      drop_frame_sand: undefined,
      drop_frame_gravel: undefined,
      drop_frame_cobble: undefined,
      drop_frame_coverage: undefined,
      drop_frame_notes: undefined,
      // Sample columns
      sample_units: undefined,
      sample_picture: undefined,
      sample_picture_taken_at: undefined,
      sample_notes: undefined,
      // shoot columns
      ...sampleColumns(3)
    }
    rows.push(row)
    for (let f of frames) {
      rows.push({ ...row, ...f })
    }
    for (let sa of samples) {
      rows.push({ ...row, ...sa })
    }
  }
  const data = await csv(rows, { header: true })

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=trip.csv')
  res.status(200).send(data)
  //res.status(200).send({})
}
