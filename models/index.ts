export interface SecchiDrop {
  depth: string
  hitBottom: boolean
}

export interface Secchi {
  depth: string
  units: string
  time: string
  drops: SecchiDrop[]
  notes: string
}

export interface Wind {
  speed: string
}

export interface Sea {
  waves: string
}

export interface Clouds {
  clouds: string
}

export interface Tide {
  state: string
}

export interface Weather {
  wind: Wind
  sea: Sea
  clouds: Clouds
  tide: Tide
}

// What is this?
export interface IndicatorShoot {}

export interface Sample {
  id?: number
  stationId: number
  units: 'm'
  picture: boolean
  pictureTakenAt: Date
  diseaseCoverage: string
  shoots: IndicatorShoot[]
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
  // Actual in the world station ID
  stationId: string
  tripId: number
  longitude: string
  latitude: string
  gpsDevice: string
  harbor: string
  isIndicatorStation: boolean
  secchi: Secchi
  frames?: DropFrame[]
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
