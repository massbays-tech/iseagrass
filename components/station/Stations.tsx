import { Station } from 'models'
import Link from 'next/link'

interface StationProps {
  station: Station
}

const StationItem: React.FC<StationProps> = ({ station }: StationProps) => {
  return (
    <li>
      {station.id}
      <div>
        {station.latitude} - {station.longitude}
      </div>
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
      <ul>
        {stations.map((s, key) => (
          <StationItem station={s} key={key} />
        ))}
      </ul>
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
      href={{ pathname: '/trips/stations', query: { tripId: id } }}
      as={`/trips/stations?tripId=${id}`}
    >
      <a>New Station</a>
    </Link>
  </div>
)
