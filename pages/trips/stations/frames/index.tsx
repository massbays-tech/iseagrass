import { useDropFrame } from 'hooks'

export default () => {
  const { loading, value: frame } = useDropFrame()

  return (
    <>
      <div>{loading}</div>
      <div>{JSON.stringify(frame)}</div>
    </>
  )
}
