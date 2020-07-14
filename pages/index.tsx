import { Version } from 'components'
import { useQuery } from 'hooks'
import { Trip } from 'models'
import moment from 'moment'
import Link from 'next/link'
import { Col, ListGroup, Row, Spinner } from 'reactstrap'

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
const ShowError = (err: Error) => <div>{err.message}</div>

export default function Home() {
  const { result: trips, error } = useQuery<Trip[]>((db) => db.getAll('trips'))

  if (!trips) return Loading()
  if (error) return ShowError(error)
  if (trips.length == 0) return NoTrips()

  return (
    <>
      <Row noGutters className="justify-content-between p-3">
        <Col xs="auto">
          <h3 className="m-0">Your Trips</h3>
        </Col>
        <Col xs="auto">
          <Link href="/trips">
            <a className="btn btn-primary" role="button">
              Start New Trip
            </a>
          </Link>
        </Col>
      </Row>
      <ListGroup flush>
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
