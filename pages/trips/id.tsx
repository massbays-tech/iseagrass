import { useRouter } from 'next/router'

export default () => {
  const router = useRouter()
  console.log('Route', router.query)

  return (
    <div>
      <div>Trip details of historical trip: {router.query.id}</div>
    </div>
  )
}
