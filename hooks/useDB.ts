import { DatabaseContext } from 'contexts/DatabaseContext'
import { Database } from 'db'
import { IDBPDatabase } from 'idb'
import { Trip } from 'models'
import { useContext, useEffect, useState } from 'react'

export const useDB = () => useContext(DatabaseContext)

export type UseTripsAccessor = (db: IDBPDatabase<Database>) => any
export const useQuery = <T>(fn: UseTripsAccessor): T | undefined => {
  const { db } = useDB()
  const [result, setResult] = useState<T | undefined>(undefined)
  useEffect(() => {
    if (db) fn(db).then(setResult)
  }, [db])
  return result
}

interface TripHook {
  trip?: Trip
  error?: Error
}

export const useTrip = (id?: number): TripHook => {
  const { db, tripId } = useDB()
  const [trip, setTrip] = useState<Trip | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  useEffect(() => {
    const query = (id || tripId).toString()
    if (db) db.get('trips', query).then(setTrip).catch(setError)
  }, [db, tripId])
  return { trip, error }
}
