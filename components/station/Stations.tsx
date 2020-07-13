import { Station } from 'models'

interface Props {
  stations: Station[]
}

const StationItem = ({ station }: { station: Station }) => {
  return (
    <li>
      {station.id}
      <div>
        {station.latitude} - {station.longitude}
      </div>
    </li>
  )
}

export const Stations = ({ stations }: Props) => {
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
