import { useTrips } from 'contexts/useDatabase'
import Link from 'next/link'
import { Col, ListGroup, ListGroupItem, Row, Spinner } from 'reactstrap'

const NoTrips = () => (
  <Row className="mt-5">
    <Col className="text-center">
      <h3>No Current Trips</h3>
      <div>You haven't taken any trips yet.</div>
      <Link href="/trips">
        <a className="btn btn-primary mt-2" role="button">
          Start New Trip
        </a>
      </Link>
    </Col>
  </Row>
)

const Loading = () => <Spinner color="primary" />

export default function Home() {
  const trips = useTrips((db) => db.getAll('trips'))

  if (!trips) return Loading()
  if (trips.length == 0) return NoTrips()

  return (
    <>
      <h3>Your Trips</h3>
      <ListGroup flush>
        {trips.map((trip) => (
          <ListGroupItem key={trip.id}>
            <Link href="trips/[id]" as={`/trips/${trip.id}`}>
              <a>Trip {trip.id}</a>
            </Link>
          </ListGroupItem>
        ))}
      </ListGroup>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Link href="/trips">
            <a className="btn btn-primary" role="button">
              Start New Trip
            </a>
          </Link>
        </Col>
      </Row>
      <button onClick={() => window.location.reload(true)}>RELOAD</button>
    </>
  )
}
