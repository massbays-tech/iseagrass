import { Stations } from 'components'
import { useDB, useQuery } from 'hooks'
import { compact, union, uniq } from 'lodash'
import { Trip } from 'models'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row
} from 'reactstrap'
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await db.put('trips', { ...trip, crew: compact(trip.crew) })
  }
  return (
    <>
      <Form onSubmit={onSubmit} className="p-3">
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
              onChange={(e) => updateCrew(i, e.target.value)}
            />
          ))}
          <FormText color="muted">
            This lets us reach out to you later if we have any questions.
          </FormText>
        </FormGroup>
        <FormGroup>
          <Label for="date">Date</Label>
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
            onChange={(e) => setTrip({ ...trip, boat: e.target.value })}
          />
        </FormGroup>
        <Row className="justify-content-between">
          <Col xs="auto" className="d-flex align-items-center">
            <Link href="/">
              <a>Back</a>
            </Link>
          </Col>
          <Col xs="auto">
            <Button value="submit" color="primary">
              Save and Continue
            </Button>
          </Col>
        </Row>
      </Form>
      <h2>Stations</h2>
      <Stations stations={trip.stations} />
      <Link
        href={{ pathname: '/trips/stations', query: { tripId: trip.id } }}
        as={`/trips/stations?tripId=${trip.id}`}
      >
        <a className="btn btn-primary">New Station</a>
      </Link>
    </>
  )
}
