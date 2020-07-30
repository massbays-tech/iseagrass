import { DatabaseContext } from 'contexts/DatabaseContext'
import { Database } from 'db'
import { IDBPDatabase } from 'idb'
import { Trip } from 'models'
import { useContext, useEffect, useState } from 'react'

export const useDB = () => useContext(DatabaseContext)

interface QueryHook<T> {
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
  return { result, error }
}

interface TripHook {
  db: IDBPDatabase<Database>
  trip?: Trip
  error?: Error
  loading: boolean
}

export const useTrip = (id: number | string | undefined): TripHook => {
  const { db } = useDB()
  const [loading, setLoading] = useState<boolean>(true)
  const [trip, setTrip] = useState<Trip | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  useEffect(() => {
    ;(async function () {
      if (db && id) {
        const query = typeof id == 'string' ? parseInt(id) : id
        try {
          setTrip(await db.get('trips', query))
        } catch (err) {
          setError(err)
        } finally {
          setLoading(false)
        }
      }
    })()
  }, [db, id])
  return { db, loading, trip, error }
}
