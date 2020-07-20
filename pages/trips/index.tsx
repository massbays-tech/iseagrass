import { ChevronLeft, Stations } from 'components'
import { useDB, useQuery } from 'hooks'
import { compact, union, uniq } from 'lodash'
import { Trip } from 'models'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Form, FormGroup, FormText, Input, Label } from 'reactstrap'
import { format } from 'util/time'

//
export default () => {
  const router = useRouter()
  const { db } = useDB()
  const id = router.query.id ? parseInt(router.query.id as string) : undefined
  const { result } = useQuery<Trip>((db) => db.get('trips', id))
  const [trip, setTrip] = useState<Trip>({
    crew: [''],
    date: new Date(),
    harbor: '',
    boat: '',
    stations: []
  })
  useEffect(() => {
    if (result) setTrip({ ...result, crew: union(uniq(result.crew), ['']) })
  }, [result])

  const updateCrew = (i: number, value: string) => {
    trip.crew[i] = value
    setTrip({
      ...trip,
      crew: union(uniq(trip.crew), [''])
    })
  }

  const save = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const id = await db.put('trips', { ...trip, crew: compact(trip.crew) })
    if (!trip.id) setTrip({ ...trip, id })
  }
  return (
    <>
      <div className="py-2">
        <Link href="/">
          <a className="d-flex align-items-center ml-2">
            <ChevronLeft />
            <span>Back to Trips</span>
          </a>
        </Link>
      </div>
      <Form onSubmit={save} className="px-3">
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
                save()
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
              save()
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
              save()
            }}
          />
        </FormGroup>
      </Form>
      <div className="mb-1 px-3 d-flex justify-content-between">
        <h3 className="font-weight-light">Stations</h3>
        <Link
          href={{ pathname: '/trips/stations', query: { tripId: trip.id } }}
          as={`/trips/stations?tripId=${trip.id}`}
        >
          <a className="btn btn-outline-primary">
            <span>New Station</span>
          </a>
        </Link>
      </div>
      <Stations id={trip.id} stations={trip.stations} />
      <div className="my-2 px-3 d-flex border-bottom">
        <h4 className="font-weight-light">Actions</h4>
      </div>
      <div className="px-3">
        <div className="my-2">
          <Button color="success" onClick={() => {}} className="w-100">
            Upload Trip Data
          </Button>
          <small className="text-black-50">
            Requires Internet. This will upload the current trip data to the
            server. You can upload multiple times if you want and only the most
            recent will be saved.
          </small>
        </div>
        <div className="my-2">
          <Button color="danger" onClick={() => {}} className="w-100">
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
