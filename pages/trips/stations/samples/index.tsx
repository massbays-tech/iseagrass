import { BackLink, DataError, Loading, UnitInput } from 'components'
import { SAMPLE_STORE } from 'db'
import { useSample } from 'hooks'
import { IndicatorShoot, Sample } from 'models'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, CustomInput, Form, FormGroup, Input, Label } from 'reactstrap'
import { htmlTime } from 'utils'

interface ShootProps {
  i: number
  shoot: IndicatorShoot
  setShoot: (shoot: IndicatorShoot) => any
}

const Shoot = ({ i, shoot, setShoot }: ShootProps) => (
  <div className="my-5">
    <div>
      <h5 className="font-weight-light">Shoot {i + 1}</h5>
    </div>
    <FormGroup>
      <UnitInput
        unit="cm"
        type="number"
        id="length"
        placeholder="Length"
        required
        value={shoot.length}
        onChange={(e) => setShoot({ ...shoot, length: e.target.value })}
      />
    </FormGroup>
    <FormGroup>
      <UnitInput
        unit="mm"
        placeholder="Width"
        type="number"
        id="width"
        required
        value={shoot.width}
        onChange={(e) => setShoot({ ...shoot, width: e.target.value })}
      />
    </FormGroup>
    <FormGroup>
      <Label for="disease-coverage">Wasting Disease Coverage</Label>
      <CustomInput
        type="select"
        id="disease-coverage"
        name="disease-coverage"
        value={shoot.diseaseCoverage}
        onChange={(e) =>
          setShoot({ ...shoot, diseaseCoverage: e.target.value })
        }
      >
        <option disabled hidden value="" />
        {['None', 'Low', 'Medium', 'High'].map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </CustomInput>
    </FormGroup>
    <FormGroup>
      <Label for="epiphyte-coverage">Epiphyte coverage</Label>
      <CustomInput
        type="select"
        id="epiphyte-coverage"
        name="epiphyte-coverage"
        value={shoot.epiphyteCoverage}
        onChange={(e) =>
          setShoot({ ...shoot, epiphyteCoverage: e.target.value })
        }
      >
        <option disabled hidden value="" />
        {['None', 'Low', 'Medium', 'High'].map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </CustomInput>
    </FormGroup>
  </div>
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
        <h2>Sample {1}</h2>
        <FormGroup>
          <Label className="ml-2" for="picture-taken">
            <input
              type="checkbox"
              id="pictre-taken"
              className="mr-2"
              checked={sample.picture}
              onChange={(e) =>
                setSample({
                  ...sample,
                  pictureTakenAt: htmlTime(new Date()),
                  picture: e.target.checked
                })
              }
              style={{ width: 20, height: 20 }}
            />
            Picture Taken?
          </Label>
        </FormGroup>
        {sample.picture && (
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
        )}
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
        <div className="d-flex mb-3">
          <Link
            href={{
              pathname: '/trips/stations',
              query: { id: sample.stationId }
            }}
            as={`/trips/stations?id=${sample.stationId}`}
          >
            <a className="btn btn-success flex-fill">Save and Back</a>
          </Link>
        </div>
        <div className="d-flex my-3">
          <Button color="danger" onClick={deleteSample} className="flex-fill">
            Delete this Sample
          </Button>
        </div>
      </Form>
    </>
  )
}
