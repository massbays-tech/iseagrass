import { Database } from 'db'
import { IDBPDatabase } from 'idb'
import { createContext, useContext, useEffect, useState } from 'react'

interface DBContextProps {
  db?: IDBPDatabase<Database>
  setDB?: any
}

export const DBContext = createContext<DBContextProps>({ db: undefined })

export const useDB = () => useContext(DBContext)

export type UseTripsAccessor = (db: IDBPDatabase<Database>) => any
export const useTrips = (fn: UseTripsAccessor) => {
  const { db } = useDB()
  const [result, setResult] = useState(undefined)
  useEffect(() => {
    if (db) fn(db).then(setResult)
  }, [db])
  return result
}
