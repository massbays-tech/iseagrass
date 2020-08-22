export interface SecchiDrop {
  depth: string
  unit: string
  hitBottom: boolean
}

export interface Location {
  longitude: string
  latitude: string
  device: string
}

export interface Secchi {
  depth: string
  unit: string
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
  diseaseCoverage: string
  epiphyteCoverage: string
}

export interface Sample {
  id?: number
  stationId: number
  units: string
  picture: boolean
  pictureTakenAt: string
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

export interface UIStationPage {
  info?: boolean
  location?: boolean
  weather?: boolean
  secchi?: boolean
  frames?: boolean
  sample?: boolean
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
  // notes for interesting things found at the station
  // that don't belong to a sub category
  notes: string
  location: Location
  weather: Weather
  secchi: Secchi
  frames?: DropFrame[]
  samples: Sample[]
  // ui helper properties
  $ui?: UIStationPage
}

type UploadStatus = 'not_uploaded' | 'uploaded' | 'error'

export interface Trip {
  id?: number
  uuid: string
  date: Date
  harbor: string
  boat: string
  crew: string[]
  stations?: Station[]
  uploaded?: UploadStatus
  uploadedAt?: Date
}

export const validDropFrame = (f: DropFrame): boolean =>
  ((f.picture && !!f.pictureTakenAt) || !f.picture) && !!f.coverage

export const validIndicatorShoot = (shoot: IndicatorShoot): boolean =>
  !!shoot.diseaseCoverage &&
  !!shoot.epiphyteCoverage &&
  !!shoot.length &&
  !!shoot.width

export const validSample = (s: Sample): boolean =>
  !!s.units &&
  ((s.picture && !!s.pictureTakenAt) || !s.picture) &&
  s.shoots.filter(validIndicatorShoot).length == s.shoots.length

export const validSecchiDrop = (s: SecchiDrop): boolean => !!s.depth && !!s.unit

export const validSecchi = (s: Secchi): boolean =>
  !!s.depth &&
  !!s.time &&
  s.drops.filter(validSecchiDrop).length == s.drops.length

export const hasEelgrass = (f: DropFrame): boolean =>
  f.coverage && f.coverage !== '0'
