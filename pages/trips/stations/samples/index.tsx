import { BackLink, DataError, Loading } from 'components'
import { SAMPLE_STORE } from 'db'
import { useSample } from 'hooks'
import { IndicatorShoot, Sample } from 'models'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CustomInput, Form, FormGroup, Input, Label } from 'reactstrap'

interface ShootProps {
  i: number
  shoot: IndicatorShoot
  setShoot: (shoot: IndicatorShoot) => any
}

const Shoot = ({ i, shoot, setShoot }: ShootProps) => (
  <>
    <div>
      <h3>Eelgrass Shoot {i + 1}</h3>
    </div>
    <FormGroup>
      <Label for="length">Length</Label>
      <Input
        type="number"
        id="length"
        required
        value={shoot.length}
        onChange={(e) => setShoot({ ...shoot, length: e.target.value })}
      />
    </FormGroup>
    <FormGroup>
      <Label for="width">Width</Label>
      <Input
        type="number"
        id="width"
        required
        value={shoot.width}
        onChange={(e) => setShoot({ ...shoot, width: e.target.value })}
      />
    </FormGroup>
    <FormGroup>
      <Label for="sea-state">Wasting Disease Coverage</Label>
      <CustomInput
        type="select"
        id="disease-coverage"
        name="disease-coverage"
        value={shoot.diseaseCoverage}
        onChange={(e) =>
          setShoot({ ...shoot, diseaseCoverage: e.target.value })
        }
      >
        {['None', 'Low', 'Medium', 'High'].map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </CustomInput>
    </FormGroup>
  </>
)

export default () => {
  const router = useRouter()
  const { loading, db, value, error } = useSample()
  const [sample, setSample] = useState<Sample>(undefined)
  useEffect(() => {
    if (value) setSample(value)
  }, [value])
  // Save Effect
  useEffect(() => {
    if (sample) {
      db.put(SAMPLE_STORE, sample)
    }
  }, [sample])

  const deleteSample = async () => {
    const response = confirm(
      'Are you sure you want to delete this indicator info?'
    )
    if (response) {
      await db.delete(SAMPLE_STORE, sample.id)
      router.push({
        pathname: '/trips/stations',
        query: {
          id: sample.stationId
        }
      })
    }
  }

  const setShoot = (i: number) => (shoot: IndicatorShoot) => {
    const { shoots } = sample
    shoots[i] = shoot
    setSample({ ...sample, shoots })
  }

  if (error) return <DataError error={error.message} />
  if (loading) return <Loading />
  if (!loading && !sample) {
    router.replace('/')
    return null
  }

  return (
    <>
      <BackLink
        name="Station"
        pathname="/trips/stations"
        id={sample.stationId}
      />
      <Form onSubmit={(e) => e.preventDefault()} className="px-3">
        <FormGroup>Picture? {sample.picture}</FormGroup>
        <FormGroup>
          <Label for="picture-time">Time Taken?</Label>
          <Input
            type="time"
            id="picture-time"
            value={sample.pictureTakenAt}
            onChange={(e) =>
              setSample({
                ...sample,
                pictureTakenAt: e.target.value
              })
            }
          />
        </FormGroup>
        {sample.shoots.map((shoot, i) => (
          <Shoot i={i} shoot={shoot} setShoot={setShoot(i)} key={i} />
        ))}
        <FormGroup>
          <Label for="notes">Notes</Label>
          <Input
            type="textarea"
            id="notes"
            value={sample.notes}
            onChange={(e) =>
              setSample({
                ...sample,
                notes: e.target.value
              })
            }
          />
        </FormGroup>
      </Form>
    </>
  )
}
