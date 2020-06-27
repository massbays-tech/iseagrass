import { useTrips } from 'contexts/useDatabase'
import Link from 'next/link'

export default function Home() {
  const trips = useTrips((db) => db.getAll('trips'))
  console.log('All trips', trips)

  return (
    <>
      <div>Next-Offline Example, try to install app via chrome</div>
      <Link href="/secchi">
        <a>Secchi</a>
      </Link>
      <button onClick={() => window.location.reload(true)}>RELOAD</button>
      <div className="">
        <Link href="/trip">
          <a className="btn btn-primary" role="button">
            Start Trip
          </a>
        </Link>
      </div>
    </>
  )
}
