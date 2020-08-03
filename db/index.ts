import { DBSchema, openDB } from 'idb'
import { DropFrame, Sample, Station, Trip } from 'models'

const VERSION = 1
const DATABASE_NAME = 'seegrass'

export const TRIP_STORE = 'trips'
export const STATION_STORE = 'stations'
export const DROP_FRAME_STORE = 'drop_frames'
export const SAMPLE_STORE = 'samples'
export type STORES = 'trips' | 'stations' | 'drop_frames' | 'samples'

export interface Database extends DBSchema {
  trips: {
    value: Trip
    key: number
  }
  stations: {
    value: Station
    key: number
    indexes: {
      tripId: number
    }
  }
  drop_frames: {
    value: DropFrame
    key: number
    indexes: {
      stationId: number
    }
  }
  samples: {
    value: Sample
    key: number
    indexes: {
      stationId: number
    }
  }
}

export const connect = () =>
  openDB<Database>(DATABASE_NAME, VERSION, {
    upgrade(db) {
      db.createObjectStore(TRIP_STORE, { keyPath: 'id', autoIncrement: true })
      db.createObjectStore(STATION_STORE, {
        keyPath: 'id',
        autoIncrement: true
      }).createIndex('tripId', 'tripId', { unique: false })
      db.createObjectStore(DROP_FRAME_STORE, {
        keyPath: 'id',
        autoIncrement: true
      }).createIndex('stationId', 'stationId', { unique: false })
      db.createObjectStore(SAMPLE_STORE, {
        keyPath: 'id',
        autoIncrement: true
      }).createIndex('stationId', 'stationId', { unique: false })
    }
  })
