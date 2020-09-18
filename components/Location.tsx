import { usePosition } from 'hooks'
import { filter, values } from 'lodash'
import { useEffect, useState } from 'react'
import { Col, Input, Label } from 'reactstrap'
import { UAParser } from 'ua-parser-js'
import { Section, Toggle } from './station'

export interface LocationUpdate {
  latitude: string
  longitude: string
  device: string
}

interface ErrorMessageProps {
  error: string
}

const ErrorMessage = ({ error }: ErrorMessageProps) => <span>{error}</span>

const ensureNegative = (s: string): string => (s.startsWith('-') ? s : `-${s}`)

interface Props {
  location: LocationUpdate
  onChange: (loc: LocationUpdate) => void
  className?: string
  open: boolean
  toggle: Toggle
}

interface LockOverlayProps {
  unlock: () => void
}

const LockOverlay = ({ unlock }: LockOverlayProps) => (
  <div
    onClick={unlock}
    className="position-absolute d-flex justify-content-center align-items-center"
    style={{
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: 1
    }}
  >
    <h3 className="text-white">Tap To Lock Location</h3>
  </div>
)

const LiveLocation = ({ onChange }) => {
  const { latitude, longitude, error } = usePosition(true, {
    timeout: 5000,
    enableHighAccuracy: true
  })
  const result = new UAParser()
  const device = result.getDevice().vendor
    ? `${result.getDevice().vendor} ${result.getDevice().model}`
    : undefined
  useEffect(() => {
    onChange({
      latitude,
      longitude,
      device
    })
  }, [latitude, longitude, device])
  return (
    <>
      <Col className="pl-0 pr-1 pb-2">
        <Input
          type="number"
          id="latitude"
          inputMode="decimal"
          required
          placeholder="Latitude"
          defaultValue={latitude ?? ''}
        />
      </Col>
      <Col className="pl-1 pr-0">
        <Input
          type="number"
          id="longitude"
          inputMode="decimal"
          required
          placeholder="Longitude"
          defaultValue={longitude ?? ''}
        />
      </Col>
      <Col xs="12" className="p-0">
        <Label for="gpsDevice">GPS Device</Label>
        <Input
          type="text"
          id="gpsDevice"
          required={true}
          defaultValue={device ?? ''}
        />
      </Col>
    </>
  )
}

interface ManualLocationProps {
  location: LocationUpdate
  onChange: (loc: LocationUpdate) => void
}

const ManualLocation = ({ location, onChange }: ManualLocationProps) => {
  return (
    <>
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
    </>
  )
}

/**
 * Location takes an optional initial location.
 */
export const Location = ({
  open,
  toggle,
  location: initial,
  onChange,
  className
}: Props) => {
  const complete = filter(values(initial), (v) => !v).length == 0
  const [locked, setLocked] = useState(complete)
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
        {!locked && (
          <>
            <LockOverlay unlock={() => setLocked(true)} />
            <LiveLocation onChange={onChange} />
          </>
        )}
        {locked && <ManualLocation location={initial} onChange={onChange} />}
      </div>
    </Section>
  )
}
