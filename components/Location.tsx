import { usePosition } from 'hooks'
import { useEffect, useState } from 'react'
import { Col, FormGroup, Input, Label } from 'reactstrap'

interface Props {}

export interface LocationUpdate {
  latitude: string
  longitude: string
  device: string
  error?: string
}

export const Location = ({}: Props) => {
  const { latitude, longitude, error } = usePosition()
  const [location, setLocation] = useState<LocationUpdate>({
    latitude: '',
    longitude: '',
    device: ''
  })
  useEffect(() => {
    if (latitude || longitude) {
      setLocation({
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
        device: 'phone'
      })
    }
  }, [latitude, longitude])

  return (
    <>
      <FormGroup row>
        <Col xs="12">
          <Label for="location">Location</Label>
        </Col>
        <Col xs="6">
          <Input
            type="number"
            id="latitude"
            inputMode="decimal"
            required={true}
            placeholder="Latitude"
            value={location.latitude}
            onChange={(e) =>
              setLocation({ ...location, latitude: e.target.value })
            }
          />
        </Col>
        <Col xs="6">
          <Input
            type="number"
            id="longitude"
            inputMode="decimal"
            required={true}
            placeholder="Longitude"
            value={location.longitude}
            onChange={(e) =>
              setLocation({ ...location, longitude: e.target.value })
            }
          />
        </Col>
      </FormGroup>
      <FormGroup>
        <Label for="gpsDevice">GPS Device</Label>
        <Input
          type="text"
          id="gpsDevice"
          required={true}
          value={location.device}
          onChange={(e) => setLocation({ ...location, device: e.target.value })}
        />
      </FormGroup>
    </>
  )
}
