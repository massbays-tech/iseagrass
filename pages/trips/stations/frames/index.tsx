import { BackLink, DataError, Loading } from 'components'
import { DROP_FRAME_STORE } from 'db'
import { useDropFrame } from 'hooks'
import { DropFrame, SedimentOptions } from 'models'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, CustomInput, Form, FormGroup, Input, Label } from 'reactstrap'

const EELGRASS_COVERAGE = ['0', '1-10', '11-30', '31-75', '76-100']

interface SedimentProps {
  name: string
  id: string
  value: boolean
  onChange: (val: boolean) => void
}

const Sediment = ({ id, name, value, onChange }: SedimentProps) => (
  <>
    <input
      type="checkbox"
      id={id}
      checked={value ?? false}
      onChange={(e) => onChange(e.target.checked)}
      style={{ width: 20, height: 20 }}
    />
    <Label className="ml-2" for={id}>
      {name}
    </Label>
  </>
)

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
  const i = parseInt(router.query.i as string)

  const next = async (e: React.MouseEvent) => {
    e.preventDefault()
    const id = await db.put(DROP_FRAME_STORE, {
      stationId: frame.stationId,
      picture: false,
      pictureTakenAt: '',
      sediments: {},
      coverage: '',
      notes: ''
    })
    router.push({
      pathname: '/trips/stations/frames',
      query: { id }
    })
  }

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
      <Form onSubmit={(e) => e.preventDefault()} className="px-3">
        <h3 className="font-weight-light">Drop Frame {frame.id}</h3>
        <FormGroup>Picture Taken?</FormGroup>
        <FormGroup>
          <Label for="time">Time</Label>
          <Input
            type="time"
            id="time"
            required
            value={frame.pictureTakenAt}
            onChange={(e) =>
              setFrame({
                ...frame,
                pictureTakenAt: e.target.value
              })
            }
          />
        </FormGroup>
        <h4 className="font-weight-light">Sediments Observed</h4>
        <ul className="list-unstyled">
          {SedimentOptions.map((name, i) => (
            <li key={i}>
              <Sediment
                id={name}
                name={name}
                value={frame.sediments[name]}
                onChange={(val: boolean) =>
                  setFrame({
                    ...frame,
                    sediments: {
                      ...frame.sediments,
                      [name]: val
                    }
                  })
                }
              />
            </li>
          ))}
        </ul>
        <FormGroup>
          <Label for="eelgrass-coverage">Eelgrass Percentage Cover</Label>
          <CustomInput
            type="select"
            id="eelgrass-coverage"
            name="eelgrass-coverage"
            value={frame.coverage}
            onChange={(e) => setFrame({ ...frame, coverage: e.target.value })}
          >
            {EELGRASS_COVERAGE.map((v) => (
              <option key={v} value={v}>
                {v}%
              </option>
            ))}
          </CustomInput>
        </FormGroup>
        <FormGroup>
          <Label for="notes">Notes</Label>
          <Input
            type="textarea"
            id="notes"
            value={frame.notes}
            onChange={(e) =>
              setFrame({
                ...frame,
                notes: e.target.value
              })
            }
          />
        </FormGroup>
        <div className="d-flex">
          <Button
            color="success"
            type="submit"
            className="flex-fill"
            onClick={next}
          >
            Save and Next
          </Button>
        </div>
      </Form>
    </>
  )
}
