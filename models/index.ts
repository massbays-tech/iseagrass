export interface SecchiDrop {
  depth: string
  hitBottom: boolean
}

export interface Location {
  longitude: string
  latitude: string
  device: string
}

export interface Secchi {
  depth: string
  units: string
  time: string
  drops: SecchiDrop[]
  notes: string
}

export interface Weather {
  wind: string
  windDirection: string
  sea: string
  clouds: string
  tide: string
}

export interface IndicatorShoot {
  length: string
  width: string
}

export interface Sample {
  id?: number
  stationId: number
  units: string
  picture: boolean
  pictureTakenAt: string
  diseaseCoverage: string
  shoots: IndicatorShoot[]
  notes: string
}

export const SedimentOptions = ['Mud', 'Clay', 'Sand', 'Gravel', 'Cobble']
export type SedimentType = 'mud' | 'clay' | 'sand' | 'gravel' | 'cobble'

// DropFrame
export interface DropFrame {
  id?: number
  stationId: number
  picture: boolean
  pictureTakenAt: string
  sediments: {
    [k in SedimentType]?: boolean
  }
  coverage: string
  notes: string
}

// Station
export interface Station {
  // Database primary key
  id?: number
  // foreign key to trip
  tripId: number
  // Actual in the world station ID
  stationId: string
  // Is this station an indicator station?
  isIndicatorStation: boolean
  // The harbor this station is in
  harbor: string
  location: Location
  weather: Weather
  secchi: Secchi
  frames?: DropFrame[]
  samples: Sample[]
}

export interface Trip {
  id?: number
  uuid: string
  date: Date
  harbor: string
  boat: string
  crew: string[]
  stations?: Station[]
}
