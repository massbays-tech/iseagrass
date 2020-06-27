export interface Station {
  id: number
  longitude: number
  latitude: number
  gpsDevice: string
  harbor: string
  isIndicatorStation: boolean
}

export interface SechiDrop {
  depth: number
  hitBottom: boolean
}

export interface Secchi {
  waterDepth: number
  units: 'm'
  time: Date
  drops: SechiDrop[]
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

export interface Indicator {
  units: 'm'
  picture: boolean
  pictureTakenAt: Date
  diseaseCoverage: string
  shoots: IndicatorShoot[]
}

export interface DropFrame {
  picture: boolean
  pictureTakenAt: Date
  sediments: string[]
  coverage: string
  notes: string
}

export interface Trip {
  date: null
  harbor: string
  boatname: string
  crew: string[]
  stations: Station[]
}
