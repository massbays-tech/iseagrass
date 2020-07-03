import { useDB, useTrip } from 'hooks'
import { usePosition } from 'hooks/usePosition'
import { Station } from 'models'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap'

interface StationState {
  id: string
  latitude: string
  longitude: string
  gpsDevice: string
  harbor: string
  isIndicatorStation: boolean
}

const convert = (s: StationState): Station => ({
  id: Number(s.id),
  latitude: Number(s.latitude),
  longitude: Number(s.longitude),
  gpsDevice: s.gpsDevice,
  harbor: s.harbor,
  isIndicatorStation: s.isIndicatorStation
})

export default () => {
  const { db } = useDB()
  const { trip } = useTrip()
  const [station, setStation] = useState<StationState>({
    id: '',
    latitude: '',
    longitude: '',
    gpsDevice: '',
    harbor: '',
    isIndicatorStation: false
  })
  const [isLocalDevice, setLocalDevice] = useState(false)
  const { latitude, longitude, error } = usePosition()

  useEffect(() => {
    if (latitude && longitude) {
      setStation({
        ...station,
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4)
      })
    }
    setLocalDevice(!!latitude && !!longitude)
  }, [latitude, longitude])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    trip.stations.push(convert(station))
    await db.put('trips', trip, trip.id.toString())
  }

  return (
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <Label for="station">Station Number</Label>
        <Input
          type="number"
          id="station"
          required={true}
          inputMode="decimal"
          value={station.id}
          onChange={(e) => setStation({ ...station, id: e.target.value })}
        />
      </FormGroup>
      <FormGroup>
        <div>
          <Label for="indicator">Indicator Station?</Label>
        </div>
        <ButtonGroup>
          <Button type="button">Yes</Button>
          <Button type="button">No</Button>
        </ButtonGroup>
      </FormGroup>
      <FormGroup>
        <Label for="harbor">Harbor</Label>
        <Input
          type="text"
          id="harbor"
          required={true}
          value={station.harbor}
          onChange={(e) => setStation({ ...station, harbor: e.target.value })}
        />
      </FormGroup>
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
            value={station.latitude}
            onChange={(e) =>
              setStation({ ...station, latitude: e.target.value })
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
            value={station.longitude}
            onChange={(e) =>
              setStation({ ...station, longitude: e.target.value })
            }
          />
        </Col>
      </FormGroup>
      {!isLocalDevice && (
        <FormGroup>
          <Label for="gpsDevice">GPS Device</Label>
          <Input type="text" id="gpsDevice" />
        </FormGroup>
      )}
      <Row className="justify-content-between">
        <Col xs="auto" className="d-flex align-items-center">
          <Link href="/">
            <a>Cancel</a>
          </Link>
        </Col>
        <Col xs="auto">
          <Button value="submit" color="primary">
            Save and Continue
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
