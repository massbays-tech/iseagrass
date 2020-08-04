import {
  ChevronLeft,
  DataError,
  DropFrames,
  Loading,
  Location
} from 'components'
import { Weather } from 'components/Weather'
import { DROP_FRAME_STORE, STATION_STORE } from 'db'
import { useStation } from 'hooks'
import { Station } from 'models'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'

interface FramesProps {
  station: Station
  onCreate: (e: React.MouseEvent) => any
}

const Frames = ({ station, onCreate }: FramesProps) => (
  <>
    <div className="mb-1 mt-2 px-3 d-flex justify-content-between">
      <h3 className="font-weight-light">Drop Frames</h3>
      <Button color="primary" outline={true} onClick={onCreate}>
        Add Drop Frame
      </Button>
    </div>
    <DropFrames frames={station.frames} onClick={onCreate} />
  </>
)

interface SettingsProps {
  onDelete: (e: React.MouseEvent) => any
}

const Settings = ({ onDelete }: SettingsProps) => (
  <>
    <div className="my-2 px-3 d-flex border-bottom">
      <h4 className="font-weight-light">Settings</h4>
    </div>
    <div className="px-3">
      <div className="my-2">
        <Button
          color="danger"
          onClick={onDelete}
          className="w-100"
          type="button"
        >
          Delete This Station Data
        </Button>
        <small className="text-black-50">
          Remove this station from the trip.
        </small>
      </div>
    </div>
  </>
)

export default () => {
  const router = useRouter()
  const { loading, db, value, error } = useStation()
  const [station, setStation] = useState<Station>(undefined)
  useEffect(() => {
    if (value) setStation(value)
  }, [value])
  // Save Effect
  useEffect(() => {
    if (station) {
      db.put(STATION_STORE, station)
    }
  }, [station])

  const createNewDropFrame = async (e: React.MouseEvent) => {
    e.preventDefault()
    const id = await db.put(DROP_FRAME_STORE, {
      stationId: station.id,
      picture: false,
      pictureTakenAt: '',
      sediments: [],
      coverage: '',
      notes: ''
    })
    router.push({
      pathname: '/trips/stations/frames',
      query: { id }
    })
  }

  const deleteStation = async () => {
    const response = confirm('Are you sure you want to delete this station?')
    if (response) {
      await db.delete(STATION_STORE, station.id)
      router.replace('/')
      router.push({
        pathname: '/trips',
        query: {
          id: station.tripId
        }
      })
    }
  }

  if (error) return <DataError error={error.message} />
  if (loading) return <Loading />
  if (!loading && !station) {
    router.replace('/')
    return null
  }

  return (
    <>
      <div className="py-2">
        <Link
          href={{ pathname: '/trips', query: { id: station.tripId } }}
          as={`/trips?id=${station.tripId}`}
        >
          <a className="d-flex align-items-center ml-2">
            <ChevronLeft />
            <span>Back to Trip</span>
          </a>
        </Link>
      </div>
      <Form onSubmit={(e) => e.preventDefault()} className="px-3">
        <h3 className="font-weight-light">Station {station.stationId}</h3>
        <FormGroup className="form-row">
          <div className="col-6">
            <Label for="station">Station Number</Label>
            <Input
              type="number"
              id="station"
              required={true}
              inputMode="decimal"
              value={station.stationId}
              onChange={(e) => {
                setStation({ ...station, stationId: e.target.value })
              }}
            />
          </div>
          <div className="col-6 align-items-center d-flex justify-content-end">
            <Label check className="mr-3">
              Indicator Station?
            </Label>
            <input type="checkbox" style={{ height: 25, width: 25 }} />{' '}
          </div>
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
        <Location />
        <Weather weather={null} />
      </Form>
      <Frames station={station} onCreate={createNewDropFrame} />
      <Settings onDelete={deleteStation} />
    </>
  )
}
