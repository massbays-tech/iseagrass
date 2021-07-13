import {
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  DataError,
  Loading
} from 'components'
import { TRIP_STORE } from 'db'
import { useDBQuery } from 'hooks'
import { compact, trim, uniq } from 'lodash'
import { Station, Trip } from 'models'
import moment from 'moment'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Col, ListGroup, Row } from 'reactstrap'
import { v4 as uuid } from 'uuid'
const { displayName } = require('../../package.json')
const PWAPrompt = dynamic(() => import('../../components/Prompt'), {
  ssr: false
})

interface NoTripProps {
  onClick: (e: React.MouseEvent) => any
}

const NoTrips = ({ onClick }: NoTripProps) => (
  <div className="mt-5">
    <Col className="text-center">
      <h3>No Current Trips</h3>
      <div>You haven&apos;t taken any trips yet.</div>
      <Button
        onClick={onClick}
        color="primary"
        outline={true}
        className="mt-2"
        aria-label="Start New Trip"
      >
        Start New Trip
      </Button>
    </Col>
  </div>
)

const TripItemStation = ({ stations }: { stations?: Station[] }) => (
  <>
    {(stations ?? []).length > 0 && (
      <span>
        {uniq(compact(stations.map(({ harbor }) => trim(harbor)))).join(', ')}
      </span>
    )}
  </>
)

const TripItem = ({ trip }: { trip: Trip }) => (
  <Link
    key={trip.id}
    href={{ pathname: '/trips', query: { id: trip.id } }}
    as={`/trips?id=${trip.id}`}
  >
    <a className="list-group-item text-dark p-2 d-flex justify-content-start align-items-center">
      {trip.uploaded == 'uploaded' ? (
        <Check className="text-success" />
      ) : (
        <Compass className="text-info" />
      )}
      <div className="ml-3">
        <div>
          Trip {trip.id} with {compact(trip.crew).join(', ')}
        </div>
        <small className="text-muted">
          <TripItemStation stations={trip.stations} /> on{' '}
          {moment(trip.date).format('MMMM Do, YYYY')} &bull;{' '}
          {trip.uploaded == 'uploaded' ? 'uploaded' : 'not uploaded'}
        </small>
      </div>
      <div className="flex-fill" />
      <ChevronRight />
    </a>
  </Link>
)

export default function Home() {
  const router = useRouter()
  const { db, result: trips, error } = useDBQuery<Trip[]>((db) =>
    db.getAll('trips')
  )
  console.log('db', db)
  console.log('Trips', trips)
  console.log('Error', error)

  const createNewTrip = async (e: React.MouseEvent) => {
    e.preventDefault()
    const id = await db.put(TRIP_STORE, {
      uuid: uuid(),
      crew: [],
      date: new Date(),
      boat: '',
      stations: []
    })
    router.push({
      pathname: '/trips',
      query: { id }
    })
  }

  if (error) return <DataError error={error.message} />
  if (!trips) return <Loading />
  if (trips.length == 0)
    return (
      <>
        <NoTrips onClick={createNewTrip} />
        <PWAPrompt
          timesToShow={3}
          delay={500}
          permanentlyHideOnDismiss={false}
          copyBody={`${displayName} has app functionality. Add it to your home screen to use while offline.`}
        />
      </>
    )

  return (
    <>
      <Link href="/">
        <a className="d-flex align-items-center ml-2 py-2">
          <ChevronLeft />
          <span>Back to Home</span>
        </a>
      </Link>
      <Row noGutters className="justify-content-between p-3">
        <Col xs="auto">
          <h3 className="font-weight-light">Your Trips</h3>
        </Col>
        <Col xs="auto">
          <Button
            onClick={createNewTrip}
            color="primary"
            outline={true}
            aria-label="Start New Trip"
          >
            Start New Trip
          </Button>
        </Col>
      </Row>
      <ListGroup flush className="px-2">
        {trips.map((trip) => (
          <TripItem trip={trip} key={trip.uuid} />
        ))}
      </ListGroup>
      <PWAPrompt
        timesToShow={3}
        delay={500}
        permanentlyHideOnDismiss={false}
        copyBody={`${displayName} has app functionality. Add it to your home screen to use while offline.`}
      />
    </>
  )
}
