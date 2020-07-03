import { Database } from 'db'
import { IDBPDatabase } from 'idb'
import { createContext } from 'react'

interface DatabaseContextProps {
  db?: IDBPDatabase<Database>
  tripId?: number
  setTripId?: any
  setDB?: any
}

export const DatabaseContext = createContext<DatabaseContextProps>({
  db: undefined
})
