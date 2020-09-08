import stringify from 'csv-stringify'
import * as admin from 'firebase-admin'
import { compact, flatten, keys, map, mapKeys, pickBy, range } from 'lodash'
import { DropFrame, Sample, SecchiDrop, Trip } from 'models'
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

// zip takes any number of arrays of objects and merges them such that
// the first elements of each are merged and the second elements of each
// are merged and so on - if
const zip = (anchor: any, ...arrays) => {
  console.log('HELP', arrays)
  let r = []
  for (let i = 0; i < Math.max(...map(arrays, 'length')); i++) {
    let o = { ...anchor }
    for (let a of arrays) {
      if (i < a.length) {
        o = { ...o, ...a[i] }
      }
    }
    r.push(o)
  }
  if (r.length == 0) {
    return [anchor]
  }
  return r
}

const secchiDrops = (drops: SecchiDrop[], start: number = 0) => {
  const prefix = 'secchi'
  return drops
    .map((d, i) =>
      mapKeys(
        {
          depth: d.depth,
          depth_unit: d.unit,
          bottom: d.hitBottom ?? false
        },
        (_, k) => `${prefix}_${k}_${i + start}`
      )
    )
    .reduce((all, o) => ({ ...all, ...o }), {})
}

const frame = (f: DropFrame, i: number): any => ({
  drop_frame_id: i,
  drop_frame_picture: f.picture,
  drop_frame_picture_time: f.pictureTakenAt,
  drop_frame_sediment: keys(pickBy(f.sediments, (v) => !!v))
    .sort()
    .join(','),
  drop_frame_eelgrass_cover: f.coverage,
  drop_frame_notes: f.notes
})

const sample = (s: Sample, i: number): any => {
  return s.shoots.map((shoot) => ({
    sample_id: i,
    sample_picture: s.picture,
    sample_picture_time: s.pictureTakenAt,
    sample_notes: s.notes,
    shoot_length: shoot.length,
    shoot_length_units: 'cm',
    shoot_width: shoot.width,
    shoot_width_units: 'mm',
    shoot_disease_coverage: shoot.diseaseCoverage,
    shoot_epiphyte_coverage: shoot.epiphyteCoverage
  }))
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
    const samples = flatten(s.samples.map(sample))
    let row = {
      boat: trip.boat,
      date: transformed.date.toISOString(),
      uuid: trip.uuid,
      crew: compact(trip.crew).join(','),
      station_id: s.stationId,
      station_harbor: s.harbor,
      indicator_station: s.isIndicatorStation,
      station_notes: s.notes,
      // Weather
      wind_knots: weather.wind,
      wind_direction: weather?.windDirection,
      sea_state: weather?.sea,
      clouds_percent_cover: weather?.clouds,
      tide: weather?.tide,
      // Location
      longitude: location?.longitude,
      latitude: location?.latitude,
      device: location?.device,
      // Secci
      water_depth: secchi?.depth,
      water_unit: secchi?.unit,
      secchi_time: secchi?.time,
      secchi_notes: secchi?.notes,
      ...secchiDrops(secchi?.drops ?? []),
      // Drop Frame
      drop_frame_id: undefined,
      drop_frame_picture: undefined,
      drop_frame_picture_time: undefined,
      drop_frame_sediment: undefined,
      drop_frame_eelgrass_cover: undefined,
      drop_frame_notes: undefined,
      // Sample columns
      sample_id: undefined,
      sample_picture: undefined,
      sample_picture_time: undefined,
      shoot_length: undefined,
      shoot_length_units: undefined,
      shoot_width: undefined,
      shoot_width_units: undefined,
      shoot_disease_coverage: undefined,
      shoot_epiphyte_coverage: undefined,
      sample_notes: undefined
    }
    rows.push(...zip(row, frames, samples))
  }
  const data = await csv(rows, { header: true })

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=trip.csv')
  res.status(200).send(data)
  //res.status(200).send({})
}
