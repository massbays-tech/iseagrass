import { BackLink, DataError, Loading } from 'components'
import { DROP_FRAME_STORE } from 'db'
import { useDropFrame } from 'hooks'
import { DropFrame } from 'models'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default () => {
  const router = useRouter()
  const { loading, db, value, error } = useDropFrame()
  const [frame, setFrame] = useState<DropFrame>(undefined)
  useEffect(() => {
    if (value) setFrame(value)
  }, [value])
  // Save Effect
  useEffect(() => {
    if (frame) {
      db.put(DROP_FRAME_STORE, frame)
    }
  }, [frame])

  if (error) return <DataError error={error.message} />
  if (loading) return <Loading />
  if (!loading && !frame) {
    router.replace('/')
    return null
  }

  return (
    <>
      <BackLink
        name="Station"
        pathname="/trips/stations"
        id={frame.stationId}
      />
      <div>{loading}</div>
      <div>{JSON.stringify(frame)}</div>
    </>
  )
}
