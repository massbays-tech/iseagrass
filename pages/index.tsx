import { DataError, Loading, Version } from 'components'
import { TRIP_STORE } from 'db'
import { useDBQuery } from 'hooks'
import { Trip } from 'models'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Col, ListGroup, Row } from 'reactstrap'
import { v4 as uuid } from 'uuid'

interface NoTripProps {
  onClick: (e: React.MouseEvent) => any
}

const NoTrips = ({ onClick }: NoTripProps) => (
  <div className="mt-5">
    <Col className="text-center">
      <h3>No Current Trips</h3>
      <div>You haven't taken any trips yet.</div>
      <Button onClick={onClick} color="primary" outline={true} className="mt-2">
        Start New Trip
      </Button>
    </Col>
  </div>
)

export default function Home() {
  const router = useRouter()
  const { db, result: trips, error } = useDBQuery<Trip[]>((db) =>
    db.getAll('trips')
  )

  const createNewTrip = async (e: React.MouseEvent) => {
    e.preventDefault()
    const id = await db.put(TRIP_STORE, {
      uuid: uuid(),
      crew: [],
      date: new Date(),
      harbor: '',
      boat: '',
      stations: []
    })
    router.push({
      pathname: '/trips',
      query: { id }
    })
  }

  if (!trips) return <Loading />
  if (error) return <DataError error={error.message} />
  if (trips.length == 0) return <NoTrips onClick={createNewTrip} />

  return (
    <>
      <Row noGutters className="justify-content-between p-3">
        <Col xs="auto">
          <h3 className="font-weight-light">Your Trips</h3>
        </Col>
        <Col xs="auto">
          <Button onClick={createNewTrip} color="primary" outline={true}>
            Start New Trip
          </Button>
        </Col>
      </Row>
      <ListGroup flush className="px-2">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            href={{ pathname: '/trips', query: { id: trip.id } }}
            as={`/trips?id=${trip.id}`}
          >
            <a className="list-group-item text-dark p-2">
              <div>
                <div>Trip {trip.id}</div>
                <small>{moment(trip.date).format('MMMM Do, YYYY')}</small>
              </div>
            </a>
          </Link>
        ))}
      </ListGroup>
      <Version />
    </>
  )
}
