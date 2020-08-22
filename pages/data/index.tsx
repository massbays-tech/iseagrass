import { DataError, Loading } from 'components'
import { Trip } from 'models'
import moment from 'moment'
import { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { Col, ListGroup, Row } from 'reactstrap'
import useSWR from 'swr'

const fetcher = (url: string, after: Date, before: Date) =>
  fetch(`${url}?after=${after}&before=${before}`).then((r) => r.json())

const NoTrips = () => (
  <div className="mt-5">
    <Col className="text-center">
      <h3>No Found Trips</h3>
      <div>No trips were found in this date range.</div>
    </Col>
  </div>
)

interface TripItemProps {
  trip: Trip
}

const TripItem = ({ trip }: TripItemProps) => (
  <div className="list-group-item text-dark p-2">
    <Row>
      <Col xs="10">
        <div>Trip {trip.uuid}</div>
        <small className="text-muted">
          {moment(trip.date).format('MMMM Do, YYYY')}
        </small>
      </Col>
      <Col xs="2">
        <a
          className="btn btn-primary"
          color="primary"
          target="_blank"
          href={`/api/csv/${trip.uuid}`}
        >
          Download
        </a>
      </Col>
    </Row>
  </div>
)

export default () => {
  const [after, setAfter] = useState(moment().subtract(1, 'year').toDate())
  const [before, setBefore] = useState(new Date())
  const { data: trips, error } = useSWR(
    ['/api/download', after.toISOString(), before.toISOString()],
    fetcher
  )

  if (error) return <DataError error={error.message} />

  return (
    <>
      <Row noGutters className="justify-content-between p-3">
        <Col xs="12">
          <h3 className="font-weight-light text-center">Download Trip Data</h3>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex">
          <h4 className="mr-2 mb-0 font-weight-normal">Trip taken After:</h4>
          <ReactDatePicker
            selected={after}
            onChange={(date: Date) => setAfter(date)}
          />
        </Col>
        <Col className="d-flex">
          <h4 className="mr-2 mb-0 font-weight-normal">Trip taken Before:</h4>
          <ReactDatePicker
            selected={before}
            onChange={(date: Date) => setBefore(date)}
          />
        </Col>
      </Row>
      {!trips && <Loading />}
      {!trips?.length && <NoTrips />}
      {!!trips?.length && (
        <ListGroup flush className="px-2 mt-5">
          {trips.map((trip, i) => (
            <TripItem trip={trip} key={trip.uuid} />
          ))}
        </ListGroup>
      )}
    </>
  )
}
