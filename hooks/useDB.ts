import { DatabaseContext } from 'contexts/DatabaseContext'
import {
  Database,
  DROP_FRAME_STORE,
  SAMPLE_STORE,
  STATION_STORE,
  STORES,
  TRIP_STORE
} from 'db'
import { IDBPDatabase } from 'idb'
import { DropFrame, Sample, Station, Trip } from 'models'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from './useQuery'

const pass = <T>(db: IDBPDatabase<Database>, val: T): Promise<T> =>
  Promise.resolve(val)

export const useDB = () => useContext(DatabaseContext)

interface QueryHook<T> {
  db: IDBPDatabase<Database>
  result: T
  error: Error
}

export type UseTripsAccessor = (db: IDBPDatabase<Database>) => any
export const useDBQuery = <T>(fn: UseTripsAccessor): QueryHook<T> => {
  const { db } = useDB()
  const [result, setResult] = useState<T | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  useEffect(() => {
    if (db) fn(db).then(setResult).catch(setError)
  }, [db])
  return { db, result, error }
}

interface StoreByKeyHook<T> {
  db: IDBPDatabase<Database>
  value?: T
  error?: Error
  loading: boolean
}

interface UseStoreOptions<T> {
  helper: (db: IDBPDatabase<Database>, val: T) => Promise<T>
}

// useStore always fetches the object by `id`
const useStore = <T>(
  store: STORES,
  { helper }: UseStoreOptions<T>
): StoreByKeyHook<T> => {
  const TIMEOUT = 5000
  const id = useQuery('id')
  const { db } = useDB()
  const [loading, setLoading] = useState<boolean>(true)
  const [value, setValue] = useState<T | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  // Most of the time this loads within milliseconds, so a shorter timeout
  // probably fair.
  useEffect(() => {
    const cancel = setTimeout(() => {
      if (!id && !value) {
        setError(new Error('Timed out trying to load from the database.'))
      }
    }, TIMEOUT)
    return () => clearTimeout(cancel)
  }, [id, value])

  useEffect(() => {
    ;(async function () {
      if (db && id) {
        try {
          const val: T = await helper(db, (await db.get(store, id)) as any)
          setValue(val)
        } catch (err) {
          setError(err)
        } finally {
          setLoading(false)
        }
      }
    })()
  }, [db, id])
  return { db, loading, value, error }
}

// useTrip loads the trip from the query param `tripId`.
// This should be used throughout the app in any component you want to load
// the trip. Most often this is the top level pages.
export const useTrip = (): StoreByKeyHook<Trip> => {
  const helper = async (
    db: IDBPDatabase<Database>,
    trip: Trip
  ): Promise<Trip> => {
    const query = IDBKeyRange.only(trip.id)
    const stations = await db.getAllFromIndex(STATION_STORE, 'tripId', query)
    return {
      ...trip,
      stations
    }
  }
  return useStore(TRIP_STORE, { helper })
}

// useStation
export const useStation = (): StoreByKeyHook<Station> => {
  const helper = async (
    db: IDBPDatabase<Database>,
    station: Station
  ): Promise<Station> => {
    const query = IDBKeyRange.only(station.id)
    const frames = await db.getAllFromIndex(
      DROP_FRAME_STORE,
      'stationId',
      query
    )
    station.frames = frames
    return station
  }

  return useStore(STATION_STORE, { helper })
}

// useDropFrame
export const useDropFrame = (): StoreByKeyHook<DropFrame> =>
  useStore(DROP_FRAME_STORE, { helper: pass })

// useSample
export const useSample = (): StoreByKeyHook<Sample> =>
  useStore(SAMPLE_STORE, { helper: pass })
