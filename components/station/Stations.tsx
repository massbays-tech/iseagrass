import { Station } from 'models'

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
  stations: Station[]
}

export const Stations: React.FC<StationsProps> = ({
  stations
}: StationsProps) => {
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
