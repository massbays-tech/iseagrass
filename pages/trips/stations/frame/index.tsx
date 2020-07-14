import { useTrip } from 'hooks'
import { useRouter } from 'next/router'

export default () => {
  const router = useRouter()
  const { loading, db, trip } = useTrip(router.query.tripId as string)

  return (
    <>
      <div>{loading}</div>
      <div>{router.query.tripId}</div>
      <div>{JSON.stringify(trip)}</div>
    </>
  )
}
