import { ChevronLeft, DataError, Loading, Location } from 'components'
import { Weather } from 'components/Weather'
import { STATION_STORE } from 'db'
import { useStation } from 'hooks'
import { Station } from 'models'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, ButtonGroup, Form, FormGroup, Input, Label } from 'reactstrap'

/*
const LocationDiscloser = () => {
  const [open, setOpen] = useState(false)
  return (
    <Disclose header={null} action={null} open={open} setOpen={setOpen}>
      <Location />
    </Disclose>
  )
}
*/

export default () => {
  const router = useRouter()
  const { loading, db, value, error } = useStation()
  const [station, setStation] = useState<Station>(undefined)
  useEffect(() => {
    if (value) setStation(value)
  }, [value])
  // Save Effect
  useEffect(() => {
    if (station) {
      db.put(STATION_STORE, station)
    }
  }, [station])

  if (error) return <DataError error={error.message} />
  if (loading) return <Loading />
  if (!loading && !station) {
    router.replace('/')
    return null
  }

  const save = async (e?: React.FormEvent) => {
    e?.preventDefault()
  }

  return (
    <>
      <div className="py-2">
        <Link
          href={{ pathname: '/trips', query: { id: station.tripId } }}
          as={`/trips?id=${station.tripId}`}
        >
          <a className="d-flex align-items-center ml-2">
            <ChevronLeft />
            <span>Back to Trip</span>
          </a>
        </Link>
      </div>
      <Form onSubmit={save} className="px-3">
        <h3 className="font-weight-light">Station {station.stationId}</h3>
        <FormGroup>
          <Label for="station">Station Number</Label>
          <Input
            type="number"
            id="station"
            required={true}
            inputMode="decimal"
            value={station.stationId}
            onChange={(e) => {
              setStation({ ...station, stationId: e.target.value })
            }}
          />
        </FormGroup>
        <FormGroup>
          <div>
            <Label for="indicator">Indicator Station?</Label>
          </div>
          <ButtonGroup className="btn-group-toggle d-flex">
            <Label
              className={`btn btn-secondary ${
                station.isIndicatorStation ? 'active' : ''
              }`}
            >
              <Input
                type="radio"
                autoComplete="off"
                checked={station.isIndicatorStation}
                onChange={(e) =>
                  setStation({
                    ...station,
                    isIndicatorStation: true
                  })
                }
              />
              Yes
            </Label>
            <Label
              className={`btn btn-secondary ${
                !station.isIndicatorStation ? 'active' : ''
              }`}
            >
              <Input
                type="radio"
                autoComplete="off"
                checked={!station.isIndicatorStation}
                onChange={(e) =>
                  setStation({
                    ...station,
                    isIndicatorStation: false
                  })
                }
              />
              No
            </Label>
          </ButtonGroup>
        </FormGroup>
        <FormGroup>
          <Label for="harbor">Harbor</Label>
          <Input
            type="text"
            id="harbor"
            required={true}
            value={station.harbor}
            onChange={(e) => setStation({ ...station, harbor: e.target.value })}
          />
        </FormGroup>
        <Location />
      </Form>
      <Weather weather={null} />
      <h1>Frames</h1>
      <Button>Add Drop Frame</Button>
    </>
  )
}
