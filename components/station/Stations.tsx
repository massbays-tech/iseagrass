import { ChevronRight } from 'components/Icon'
import { Station } from 'models'
import Link from 'next/link'
import { ListGroup } from 'reactstrap'

interface StationProps {
  index: number
  tripId: number
  station: Station
}

const StationItem: React.FC<StationProps> = ({
  index,
  tripId,
  station
}: StationProps) => {
  return (
    <li className="list-group-item">
      <Link
        href={{
          pathname: '/trips/stations',
          query: { id: tripId, stationId: index }
        }}
        as={`/trips/stations?id=${tripId}&stationId=${index}`}
      >
        <a className="text-dark d-flex justify-content-between align-items-center">
          <div>
            <div>Station {station.id}</div>
            <small className="text-black-50">
              ({station.latitude},{station.longitude})
            </small>
          </div>
          <ChevronRight />
        </a>
      </Link>
    </li>
  )
}

interface StationsProps {
  id: number
  stations: Station[]
}

export const Stations: React.FC<StationsProps> = ({
  id,
  stations
}: StationsProps) => {
  if (!stations || stations.length == 0) {
    return <BlankSlate id={id} />
  }
  return (
    <>
      <ListGroup flush>
        {stations.map((s, key) => (
          <StationItem station={s} tripId={id} index={key} key={key} />
        ))}
      </ListGroup>
    </>
  )
}

interface BlankSlateProps {
  id: number
}

const BlankSlate: React.FC<BlankSlateProps> = ({ id }: BlankSlateProps) => (
  <div className="bg-light p-5 text-center">
    <div style={{ fontSize: '1.25rem' }}>No Stations</div>
    <Link
      href={{ pathname: '/trips/stations', query: { id } }}
      as={`/trips/stations?id=${id}`}
    >
      <a>New Station</a>
    </Link>
  </div>
)
