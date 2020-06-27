import { DBSchema, openDB } from 'idb'
import { Trip } from 'models'

const VERSION = 1

export interface Database extends DBSchema {
  trips: {
    value: Trip
    key: string
  }
}

export const connect = () =>
  openDB<Database>('eelgrass', VERSION, {
    upgrade(db) {
      db.createObjectStore('trips', { keyPath: 'id', autoIncrement: true })
    }
  })
