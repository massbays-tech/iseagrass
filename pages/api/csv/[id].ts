import stringify from 'csv-stringify'
import * as admin from 'firebase-admin'
import { compact, flatten, keys, mapKeys, pickBy, range } from 'lodash'
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
  drop_frame_id: number
  drop_frame_picture: boolean
  drop_frame_picture_time: string
  drop_frame_sediment: string
  drop_frame_eelgrass_cover: string
  drop_frame_notes: string
}

interface SampleRow {
  sample_id: number
  sample_picture: boolean
  sample_picture_time: string
  sample_notes: string
  shoot_length: number
  shoot_length_units: 'cm'
  shoot_width: number
  shoot_width_units: 'mm'
  shoot_disease_coverage: string
  shoot_epiphyte_coverage: string
}

const EmptyFrame: DropFrameRow = {
  drop_frame_id: undefined,
  drop_frame_picture: undefined,
  drop_frame_picture_time: undefined,
  drop_frame_sediment: undefined,
  drop_frame_eelgrass_cover: undefined,
  drop_frame_notes: undefined
}

const EmptySample: SampleRow = {
  sample_id: undefined,
  sample_picture: undefined,
  sample_picture_time: undefined,
  sample_notes: undefined,
  shoot_length: undefined,
  shoot_length_units: undefined,
  shoot_width: undefined,
  shoot_width_units: undefined,
  shoot_disease_coverage: undefined,
  shoot_epiphyte_coverage: undefined
}

// zip takes any number of arrays of objects and merges them such that
// the first elements of each are merged and the second elements of each
// are merged and so on - if
const zip = (row, frames, samples) => {
  let rows = []
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i]
    const r = frames[Math.floor(i / 3)]
    rows.push({
      ...row,
      ...r,
      ...s
    })
  }
  return rows
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
  drop_frame_id: i + 1,
  drop_frame_picture: f.picture,
  drop_frame_picture_time: f.pictureTakenAt,
  drop_frame_sediment: keys(pickBy(f.sediments, (v) => !!v))
    .sort()
    .join(','),
  drop_frame_eelgrass_cover: f.coverage,
  drop_frame_notes: f.notes
})

const sample = (s: Sample, i: number): any => {
  return s.shoots.map((shoot, n) => ({
    sample_id: i + 1,
    sample_picture: s.picture,
    sample_picture_time: s.pictureTakenAt,
    sample_notes: s.notes,
    shoot_id: n + 1,
    shoot_length: shoot.length,
    shoot_length_units: 'cm',
    shoot_width: shoot.width,
    shoot_width_units: 'mm',
    shoot_disease_coverage: shoot.diseaseCoverage,
    shoot_epiphyte_coverage: shoot.epiphyteCoverage
  }))
}

const ensure = <T>(arr: T[], obj: T, n: number): T[] =>
  arr.length == n
    ? arr
    : arr.concat(range(0, n - arr.length).map(() => ({ ...obj })))

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

  const date = transformed.date.toISOString()
  const crew = compact(trip.crew).join(',')

  let rows = []
  for (let s of transformed.stations) {
    const { weather, location, secchi } = s
    const frames = ensure(s.frames.map(frame), EmptyFrame, 4)
    const samples = ensure(flatten(s.samples.map(sample)), EmptySample, 12)
    let row = {
      boat: trip.boat,
      date,
      uuid: trip.uuid,
      crew,
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
      accuracy: location?.accuracy,
      device: location?.device,
      // Secci
      water_depth: secchi?.depth,
      water_unit: secchi?.unit,
      secchi_time: secchi?.time,
      secchi_notes: secchi?.notes,
      ...secchiDrops(secchi?.drops ?? [], 1),
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
      shoot_id: undefined,
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

  const name = `trip_on_${date}_with_${compact(trip.crew)
    .join('_')
    .toLowerCase()}.csv`
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename=${name}`)
  res.status(200).send(data)
  //res.status(200).send({})
}
