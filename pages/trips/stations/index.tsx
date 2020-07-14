import { ChevronLeft } from 'components'
import { Weather } from 'components/Weather'
import { useDB, usePosition, useTrip } from 'hooks'
import { Station } from 'models'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
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

// StationState holds the station data as easily editable strings for React
// components.
interface StationState {
  id: string
  latitude: string
  longitude: string
  gpsDevice: string
  harbor: string
  isIndicatorStation: boolean
}

const toState = (s: Station) => ({
  ...s,
  id: s.id ? `${s.id}` : '',
  latitude: s.latitude ? `${s.latitude}` : '',
  longitude: s.longitude ? `${s.longitude}` : ''
})

const param = (r: NextRouter, param: string): number | undefined =>
  r.query[param] ? parseInt(r.query[param] as string) : undefined

const DEFAULT = {
  id: '',
  latitude: '',
  longitude: '',
  gpsDevice: '',
  harbor: '',
  isIndicatorStation: false
}

// Station Page
// Requires tripId
// If stationId is present, load that station, otherwise create a new station
// TODO: Fix when offline mode works with [id]
export default () => {
  const router = useRouter()
  const { db } = useDB()
  const [tripId, setTripId] = useState<number | undefined>(undefined)
  const [stationId, setStationId] = useState<number | undefined>(undefined)
  const { loading, trip } = useTrip(tripId)
  const [station, setStation] = useState<StationState>(DEFAULT)
  const { latitude, longitude, error } = usePosition()
  // useWeather()

  useEffect(() => {
    setTripId(param(router, 'tripId'))
    setStationId(param(router, 'stationId'))
    if (trip) {
      setStation(toState(trip.stations[stationId]))
    }
  }, [router.query.tripId])

  useEffect(() => {
    if (latitude || longitude) {
      setStation({
        ...station,
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4),
        gpsDevice: 'phone'
      })
    }
  }, [latitude, longitude])

  // Trip ID is a required param
  if (!loading && !tripId) {
    router.replace('/')
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await db.put('trips', { ...trip, stations: [...trip.stations] })
    router.push('/stations')
  }

  return (
    <>
      <div className="py-2">
        <Link
          href={{ pathname: '/trips', query: { id: tripId } }}
          as={`/trips?id=${tripId}`}
        >
          <a className="d-flex align-items-center ml-2">
            <ChevronLeft />
            <span>Back to Trip</span>
          </a>
        </Link>
      </div>
      <Form onSubmit={onSubmit} className="px-3">
        <h3 className="font-weight-light">Station {station.id}</h3>
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
          <ButtonGroup className="btn-group-toggle d-flex">
            <Label
              className={`btn btn-secondary ${
                station.isIndicatorStation ? 'active' : ''
              }`}
            >
              <Input
                type="radio"
                autoComplete="off"
                checked={station.isIndicatorStation}
                onChange={(e) =>
                  setStation({
                    ...station,
                    isIndicatorStation: true
                  })
                }
              />
              Yes
            </Label>
            <Label
              className={`btn btn-secondary ${
                !station.isIndicatorStation ? 'active' : ''
              }`}
            >
              <Input
                type="radio"
                autoComplete="off"
                checked={!station.isIndicatorStation}
                onChange={(e) =>
                  setStation({
                    ...station,
                    isIndicatorStation: false
                  })
                }
              />
              No
            </Label>
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
        <FormGroup>
          <Label for="gpsDevice">GPS Device</Label>
          <Input
            type="text"
            id="gpsDevice"
            required={true}
            value={station.gpsDevice}
            onChange={(e) =>
              setStation({ ...station, gpsDevice: e.target.value })
            }
          />
        </FormGroup>
        <Row className="justify-content-between">
          <Col xs="auto" className="d-flex align-items-center">
            <Link
              href={{ pathname: '/trips', query: { id: tripId } }}
              as={`/trips?id=${tripId}`}
            >
              <a className="list-group-item text-dark p-2">Cancel and Back</a>
            </Link>
          </Col>
          <Col xs="auto">
            <Button value="submit" color="primary">
              Save and Continue
            </Button>
          </Col>
        </Row>
      </Form>
      <Weather weather={null} />
      <h1>Frames</h1>
      <Link
        href={{ pathname: '/trips/stations/frames', query: { tripId } }}
        as={`/trips/stations/frames?tripId=${tripId}`}
      >
        <a className="btn btn-primary">Add Drop Frame</a>
      </Link>
    </>
  )
}
