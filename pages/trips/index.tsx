import { BackLink, DataError, Loading, Stations } from 'components'
import { STATION_STORE, TRIP_STORE } from 'db'
import { useTrip } from 'hooks'
import { compact, union, uniq } from 'lodash'
import { Trip } from 'models'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Form, FormGroup, FormText, Input, Label } from 'reactstrap'
import { format, htmlTime } from 'utils/time'

// This will always return a trip, or if none found then the user should be
// redirected
export default () => {
  const router = useRouter()
  const { loading, db, value, error } = useTrip()
  const [trip, setTrip] = useState<Trip | undefined>(undefined)
  useEffect(() => {
    if (value) setTrip({ ...value, crew: union(uniq(value.crew), ['']) })
  }, [value])
  useEffect(() => {
    if (trip) {
      db.put('trips', { ...trip, crew: compact(trip.crew) })
    }
  }, [trip])

  // Update the crew and ensure there is only 1 blank line included for
  // adding a new member. Members with the exact same name are removed.
  // TODO: *BUG* Iff multiple people typed in with same name
  const updateCrew = (i: number, value: string) => {
    trip.crew[i] = value
    setTrip({
      ...trip,
      crew: union(uniq(trip.crew), [''])
    })
  }

  // TODO: Additional validation if the trip has not been deleted?
  const deleteTrip = async () => {
    const response = confirm('Are you sure you want to delete this trip?')
    if (response) {
      await db.delete(TRIP_STORE, trip.id)
      router.replace('/trips/list')
    }
  }

  const upload = async () => {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify(trip),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const createNewStation = async (e: React.MouseEvent) => {
    e.preventDefault()
    const id = await db.put(STATION_STORE, {
      tripId: trip.id,
      stationId: '',
      isIndicatorStation: false,
      harbor: '',
      notes: '',
      location: {
        longitude: '',
        latitude: '',
        device: ''
      },
      secchi: {
        depth: '',
        unit: 'ft',
        time: htmlTime(new Date()),
        drops: [
          { depth: '', hitBottom: false, unit: 'm' },
          { depth: '', hitBottom: false, unit: 'm' }
        ],
        notes: ''
      },
      weather: {
        wind: '',
        windDirection: '',
        sea: '',
        clouds: '',
        tide: ''
      },
      samples: [],
      // Start with Station info open
      $ui: { info: true }
    })
    router.push({
      pathname: '/trips/stations',
      query: { id }
    })
  }

  // This page is only ever displayed if the trip has already been created.
  // If we are finished loading and still don't have a trip, the most likely
  // situation is this trip does not exist. Redirect back to `/trips`
  if (error) return <DataError error={error.message} />
  if (loading) return <Loading />
  if (!loading && !trip) {
    router.replace('/')
    return null
  }

  return (
    <>
      <BackLink name="trips" pathname="/trips/list" />
      <Form onSubmit={(e) => e.preventDefault()} className="px-3">
        <h3 className="font-weight-light">Trip Details</h3>
        <FormGroup>
          <Label for="crew">Crew Members</Label>
          {trip.crew.map((c, i) => (
            <Input
              className={`${i > 0 ? 'mt-3' : ''}`}
              key={i}
              type="text"
              id={`crew-${i}`}
              placeholder="Full name..."
              required={i == 0}
              value={c}
              onChange={(e) => {
                updateCrew(i, e.target.value)
              }}
            />
          ))}
          <FormText color="muted">
            This lets us reach out to you later if we have any questions.
          </FormText>
        </FormGroup>
        <FormGroup>
          <Label for="date">Trip Date</Label>
          <Input
            type="date"
            id="date"
            required={true}
            value={format(trip.date)}
            onChange={(e) => {
              setTrip({
                ...trip,
                date: new Date(e.target.value)
              })
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="boat">Boat Name</Label>
          <Input
            type="text"
            name="boat"
            id="boat"
            required={true}
            value={trip.boat}
            onChange={(e) => {
              setTrip({ ...trip, boat: e.target.value })
            }}
          />
        </FormGroup>
      </Form>
      <div className="mb-1 px-3 d-flex justify-content-between">
        <h3 className="font-weight-light">Stations</h3>
        <Button color="primary" outline={true} onClick={createNewStation}>
          Add Station
        </Button>
      </div>
      <Stations stations={trip.stations} onClick={createNewStation} />
      <div className="my-2 px-3 d-flex border-bottom">
        <h4 className="font-weight-light">Actions</h4>
      </div>
      <div className="px-3">
        <div className="my-2">
          <Button color="success" onClick={upload} className="w-100">
            Upload Trip Data
          </Button>
          <small className="text-black-50">
            Requires Internet. This will upload the current trip data to the
            server. You can upload multiple times if you want and only the most
            recent will be saved.
          </small>
        </div>
        <div className="my-2">
          <Button
            color="danger"
            onClick={deleteTrip}
            className="w-100"
            type="button"
          >
            Delete This Trip
          </Button>
          <small className="text-black-50">
            Remove this trip from your device. This is safe to do once you have
            uploaded the data.
          </small>
        </div>
      </div>
    </>
  )
}
