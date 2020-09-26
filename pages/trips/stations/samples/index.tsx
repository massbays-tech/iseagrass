import { BackLink, Camera, DataError, Loading, UnitInput } from 'components'
import {
  Button as HelpButton,
  LengthHelp,
  WastingDiseaseCoverageHelp
} from 'components/help'
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
    <div className="mb-2 d-flex align-items-center justify-content-between">
      <h5 className="font-weight-light">Shoot {i + 1}</h5>
      <HelpButton title="Length">
        <LengthHelp />
      </HelpButton>
    </div>
    <FormGroup>
      <UnitInput
        unit="cm"
        type="number"
        inputMode="decimal"
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
        inputMode="decimal"
        id="width"
        required
        value={shoot.width}
        onChange={(e) => setShoot({ ...shoot, width: e.target.value })}
      />
    </FormGroup>
    <FormGroup>
      <div className="mb-2 d-flex align-items-center justify-content-between">
        <Label for="disease-coverage" className="mb-0">
          Wasting Disease Coverage
        </Label>
        <HelpButton title="Wasting Disease Coverage">
          <WastingDiseaseCoverageHelp />
        </HelpButton>
      </div>
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
      <div className="mb-2 d-flex align-items-center justify-content-between">
        <Label for="epiphyte-coverage" className="mb-0">
          Epiphyte coverage
        </Label>
        <HelpButton title="Wasting Disease Coverage">
          <WastingDiseaseCoverageHelp />
        </HelpButton>
      </div>
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

const Index = () => {
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
  const i = parseInt(router.query.i as string)

  const deleteSample = async () => {
    const response = confirm('Are you sure you want to delete this sample?')
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
        name={`Station ${sample.stationId}`}
        pathname="/trips/stations"
        id={sample.stationId}
        hash="#indicator-samples"
      />
      <Form onSubmit={(e) => e.preventDefault()} className="px-3">
        <h3 className="font-weight-light">Sample {i + 1}</h3>
        {sample.shoots.map((shoot, i) => (
          <Shoot i={i} shoot={shoot} setShoot={setShoot(i)} key={i} />
        ))}
        <FormGroup>
          <Label
            className="mb-0 d-flex flex-fill align-items-center"
            for="picture-taken"
          >
            <Camera width="4rem" height="4rem" className="text-info" />
            <input
              type="checkbox"
              id="picture-taken"
              className="mx-2"
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
            <Label for="picture-time">Time Picture Taken</Label>
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
              query: { id: sample.stationId },
              hash: '#indicator-samples'
            }}
            scroll={false}
            as={`/trips/stations?id=${sample.stationId}#indicator-samples`}
          >
            <a className="btn btn-success flex-fill">Save and Back</a>
          </Link>
        </div>
        <div className="d-flex my-3">
          <Button
            color="danger"
            onClick={deleteSample}
            className="flex-fill"
            aria-label="Delete this Sample"
          >
            Delete this Sample
          </Button>
        </div>
      </Form>
    </>
  )
}

export default Index
