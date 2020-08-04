import { usePosition } from 'hooks'
import { isNumber } from 'lodash'
import { useEffect, useState } from 'react'
import { Col, Collapse, Input, Label, Row, Spinner } from 'reactstrap'
import { Check, ChevronRight } from './Icon'

export interface LocationUpdate {
  latitude: string
  longitude: string
  device: string
  error?: string
}

interface ErrorMessageProps {
  error: string
}

const ErrorMessage = ({ error }: ErrorMessageProps) => <span>{error}</span>

interface Props {
  location: LocationUpdate
  onChange: (loc: LocationUpdate) => void
}

export const Location = ({ location: initial, onChange }: Props) => {
  const { loading, latitude, longitude, error } = usePosition()
  const [open, setOpen] = useState(false)
  const [location, setLocation] = useState<LocationUpdate>({
    latitude: initial.latitude || '',
    longitude: initial.longitude || '',
    device: initial.device || ''
  })
  const success = !loading && latitude && longitude && !error

  const update = (loc: LocationUpdate) => {
    setLocation(loc)
    onChange(loc)
  }

  useEffect(() => {
    if (isNumber(latitude) || isNumber(longitude)) {
      update({
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
        device: 'phone'
      })
    }
  }, [latitude, longitude])

  const toggle = () => {
    setOpen(!open)
  }

  return (
    <Row
      className="border-top border-bottom"
      style={{ borderLeft: '4px #90CDF4 solid' }}
    >
      <Col
        xs="12"
        className="d-flex align-items-center justify-content-start"
        onClick={toggle}
      >
        <h4 className="font-weight-light my-2">Location</h4>
        {loading && <Spinner size="sm" color="primary" className="ml-2" />}
        {error && <ErrorMessage error={error} />}
        {success && <Check className="ml-2 text-success" />}
        <span className="flex-fill" />
        <ChevronRight
          style={{
            transform: `rotate(${open ? '90' : '0'}deg)`,
            transition: '.35s ease'
          }}
        />
      </Col>
      <Collapse isOpen={open} className="w-100 pb-3">
        <div className="d-flex flex-wrap px-3">
          <Col className="pl-0 pr-1 pb-2">
            <Input
              type="number"
              id="latitude"
              inputMode="decimal"
              required={true}
              placeholder="Latitude"
              value={location.latitude}
              onChange={(e) =>
                update({ ...location, latitude: e.target.value })
              }
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
              onChange={(e) =>
                update({ ...location, longitude: e.target.value })
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
              onChange={(e) => update({ ...location, device: e.target.value })}
            />
          </Col>
        </div>
      </Collapse>
      <Col
        xs="12"
        style={{ maxHeight: open ? 200 : 0 }}
        className="d-flex"
      ></Col>
    </Row>
  )
}
