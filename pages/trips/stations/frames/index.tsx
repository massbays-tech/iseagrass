import { BackLink, Camera, DataError, Loading } from 'components'
import { Button as HelpButton, EelgrassPercentCoverHelp } from 'components/help'
import { DROP_FRAME_STORE } from 'db'
import { useDropFrame } from 'hooks'
import { toLower } from 'lodash'
import { DropFrame, SedimentOptions } from 'models'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, CustomInput, Form, FormGroup, Input, Label } from 'reactstrap'
import { htmlTime } from 'utils'

const EELGRASS_COVERAGE = [
  '0%',
  '1% - 10%',
  '11% - 30%',
  '31% - 75%',
  '76% - 100%'
]

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

const Index = () => {
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

  const deleteFrame = async () => {
    const response = confirm('Are you sure you want to delete this drop frame?')
    if (response) {
      await db.delete(DROP_FRAME_STORE, frame.id)
      router.push({
        pathname: '/trips/stations',
        query: {
          id: frame.stationId
        }
      })
      return
    }
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
        name={`Station ${frame.stationId}`}
        pathname="/trips/stations"
        hash="#drop-frames"
        id={frame.stationId}
      />
      <Form onSubmit={(e) => e.preventDefault()} className="px-3">
        <h3 className="font-weight-light">Drop Frame {i + 1}</h3>
        <h4 className="font-weight-light mb-0">Sediments Observed</h4>
        <small className="d-block mb-2 text-black-50">
          Check all that apply.
        </small>
        <ul className="list-unstyled">
          {SedimentOptions.map((name, i) => (
            <li key={i}>
              <Sediment
                id={name}
                name={name}
                value={frame.sediments[toLower(name)]}
                onChange={(val: boolean) =>
                  setFrame({
                    ...frame,
                    sediments: {
                      ...frame.sediments,
                      [toLower(name)]: val
                    }
                  })
                }
              />
            </li>
          ))}
        </ul>
        <FormGroup>
          <div className="mb-2 d-flex align-items-center justify-content-between">
            <Label for="eelgrass-coverage" className="mb-0">
              Eelgrass Percentage Cover
            </Label>
            <HelpButton title="Eelgrass Percent Cover">
              <EelgrassPercentCoverHelp />
            </HelpButton>
          </div>
          <CustomInput
            type="select"
            id="eelgrass-coverage"
            name="eelgrass-coverage"
            value={frame.coverage}
            onChange={(e) => setFrame({ ...frame, coverage: e.target.value })}
          >
            <option disabled hidden value="" />
            {EELGRASS_COVERAGE.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </CustomInput>
        </FormGroup>

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
              checked={frame.picture}
              onChange={(e) =>
                setFrame({
                  ...frame,
                  pictureTakenAt: htmlTime(new Date()),
                  picture: e.target.checked
                })
              }
              style={{ width: 20, height: 20 }}
            />
            Picture Taken?
          </Label>
        </FormGroup>
        {frame.picture && (
          <FormGroup>
            <Label for="picture-time">Time Picture Taken</Label>
            <Input
              type="time"
              id="picture-time"
              value={frame.pictureTakenAt}
              onChange={(e) =>
                setFrame({
                  ...frame,
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
            value={frame.notes}
            onChange={(e) =>
              setFrame({
                ...frame,
                notes: e.target.value
              })
            }
          />
        </FormGroup>
        <div className="d-flex my-3">
          <Link
            href={{
              pathname: '/trips/stations',
              query: { id: frame.stationId },
              hash: '#drop-frames'
            }}
            as={`/trips/stations?id=${frame.stationId}#drop-frames`}
          >
            <a className="btn btn-success flex-fill">
              Save and Return to Station
            </a>
          </Link>
        </div>
        <div className="d-flex my-3">
          <Button color="danger" onClick={deleteFrame} className="flex-fill">
            Delete this Drop Frame
          </Button>
        </div>
      </Form>
    </>
  )
};

export default Index;
