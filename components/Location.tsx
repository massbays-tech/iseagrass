import { usePosition } from 'hooks'
import { filter, toString, values } from 'lodash'
import { Button, Col, Input, Label } from 'reactstrap'
import { UAParser } from 'ua-parser-js'
import { Section, Toggle } from './station'

export interface LocationUpdate {
  latitude: string
  longitude: string
  device: string
}

interface ErrorMessageProps {
  children: React.ReactNode
}

const ErrorMessage = ({ children }: ErrorMessageProps) => (
  <div className="text-danger">Error: {children}</div>
)

const ensureNegative = (s: string): string => (s.startsWith('-') ? s : `-${s}`)

interface Props {
  location: LocationUpdate
  onChange: (loc: LocationUpdate) => void
  className?: string
  open: boolean
  toggle: Toggle
}

/**
 * Location takes an optional initial location.
 */
export const Location = ({
  open,
  toggle,
  location,
  onChange,
  className
}: Props) => {
  const { accuracy, latitude, longitude, error } = usePosition(true, {
    timeout: 5000,
    enableHighAccuracy: true
  })

  const fromDevice = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const result = new UAParser()
    const device = result.getDevice().vendor
      ? `${result.getDevice().vendor} ${result.getDevice().model}`
      : undefined
    onChange({
      latitude: toString(latitude),
      longitude: toString(longitude),
      device
    })
  }

  const complete = filter(values(location), (v) => !v).length == 0
  console.log(latitude, longitude, error)
  return (
    <Section
      title="Location"
      complete={complete}
      className={className}
      id="location"
      open={open}
      toggle={toggle}
    >
      <div className="d-flex flex-wrap p-3 position-relative">
        <Col className="pl-0 pr-1 pb-2">
          <Input
            type="number"
            id="latitude"
            inputMode="decimal"
            required
            placeholder="Latitude"
            value={location.latitude}
            onChange={(e) =>
              onChange({
                ...location,
                latitude: e.target.value
              })
            }
          />
          {latitude && (
            <div>
              <small className="text-black-50" style={{ marginLeft: 12 }}>
                ({latitude})
              </small>
            </div>
          )}
        </Col>
        <Col className="pl-1 pr-0">
          <Input
            type="number"
            id="longitude"
            inputMode="decimal"
            required
            placeholder="Longitude"
            value={location.longitude}
            onChange={(e) =>
              onChange({
                ...location,
                longitude: ensureNegative(e.target.value)
              })
            }
          />
          {longitude && (
            <div>
              <small className="text-black-50" style={{ marginLeft: 12 }}>
                ({longitude})
              </small>
            </div>
          )}
        </Col>
        <Col xs="12" className="pl-1 pr-0 mb-3">
          <div>
            <Button
              color="info"
              onClick={fromDevice}
              className="w-100"
              disabled={
                !latitude ||
                !longitude ||
                (+location.latitude == latitude &&
                  +location.longitude == longitude)
              }
            >
              Update From Device
            </Button>
          </div>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <small className="text-black-50 d-block">
            This device is accurate within {accuracy} meters.
          </small>
        </Col>
        <Col xs="12" className="p-0">
          <Label for="gpsDevice">GPS Device</Label>
          <Input
            type="text"
            id="gpsDevice"
            required={true}
            value={location.device}
            onChange={(e) =>
              onChange({
                ...location,
                device: e.target.value
              })
            }
          />
        </Col>
      </div>
    </Section>
  )
}
