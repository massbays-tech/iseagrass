import { useEffect, useState } from 'react'

export const TimeoutError = 'Timeout expired'

const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0
}

interface Position {
  loading: boolean
  latitude?: number
  longitude?: number
  accuracy?: number
  timestamp?: number
}

interface Settings {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

// Extended from: https://github.com/trekhleb/use-position
export const usePosition = (
  watch = false,
  settings: Settings = defaultSettings
) => {
  const [position, setPosition] = useState<Position>({ loading: true })
  const [error, setError] = useState<string | null>(undefined)

  const onChange: PositionCallback = ({ coords, timestamp }) => {
    if (error && coords.latitude && coords.longitude) {
      setError(undefined)
    }
    setPosition({
      loading: false,
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      timestamp
    })
  }

  const onError: PositionErrorCallback = (error: PositionError) => {
    setError(error.message)
  }

  useEffect(() => {
    if (!navigator || !navigator.geolocation) {
      setError('Geolocation is not supported')
      return
    }

    let watcher = null
    if (watch) {
      watcher = navigator.geolocation.watchPosition(onChange, onError, settings)
    } else {
      navigator.geolocation.getCurrentPosition(onChange, onError, settings)
    }

    return () => watcher && navigator.geolocation.clearWatch(watcher)
  }, [settings.enableHighAccuracy, settings.timeout, settings.maximumAge])

  return { ...position, error }
}
