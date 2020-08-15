import { usePosition } from 'hooks'
import { filter, isNumber, values } from 'lodash'
import { useEffect, useState } from 'react'
import { Col, Input, Label } from 'reactstrap'
import { UAParser } from 'ua-parser-js'
import { Section } from './station'

export interface LocationUpdate {
  latitude: string
  longitude: string
  device: string
}

interface ErrorMessageProps {
  error: string
}

const ErrorMessage = ({ error }: ErrorMessageProps) => <span>{error}</span>

interface Props {
  location: LocationUpdate
  onChange: (loc: LocationUpdate) => void
  className?: string
}

export const Location = ({ location: initial, onChange, className }: Props) => {
  const { loading, latitude, longitude, error } = usePosition()
  const [location, setLocation] = useState<LocationUpdate>({
    latitude: initial.latitude || '',
    longitude: initial.longitude || '',
    device: initial.device || ''
  })
  const success = !loading && latitude && longitude && !error

  const update = (loc: LocationUpdate) => {
    // We are doing all our work in the western hemisphere, so we automatically
    // ensure it's correct.
    if (loc.longitude == '-') {
      loc.longitude = ''
    } else if (loc.longitude && !loc.longitude.startsWith('-')) {
      loc.longitude = '-' + loc.longitude
    }
    setLocation(loc)
    onChange(loc)
  }

  useEffect(() => {
    if (initial.latitude || initial.longitude) {
      return
    }
    if (isNumber(latitude) || isNumber(longitude)) {
      const result = new UAParser()
      const device = `${result.getDevice().vendor} ${result.getDevice().type} ${
        result.getDevice().model
      }`
      update({
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
        device
      })
    }
  }, [initial, latitude, longitude])

  const complete = filter(values(location), (v) => !v).length == 0

  // {loading && <Spinner size="sm" color="primary" className="ml-2" />}
  // {error && <ErrorMessage error={error} />}
  // {success && <Check className="ml-2 text-success" />}

  return (
    <Section title="Location" complete={complete} className={className}>
      <div className="d-flex flex-wrap px-3">
        <Col className="pl-0 pr-1 pb-2">
          <Input
            type="number"
            id="latitude"
            inputMode="decimal"
            required={true}
            placeholder="Latitude"
            value={location.latitude}
            onChange={(e) => update({ ...location, latitude: e.target.value })}
          />
        </Col>
        <Col className="pl-1 pr-0">
          <Input
            type="number"
            id="longitude"
            inputMode="decimal"
            required={true}
            placeholder="Longitude"
            value={location.longitude}
            onChange={(e) => update({ ...location, longitude: e.target.value })}
          />
        </Col>
        <Col xs="12" className="p-0">
          <Label for="gpsDevice">GPS Device</Label>
          <Input
            type="text"
            id="gpsDevice"
            required={true}
            value={location.device}
            onChange={(e) => update({ ...location, device: e.target.value })}
          />
        </Col>
      </div>
    </Section>
  )
}
