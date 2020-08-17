import {
  BackLink,
  DataError,
  DropFrames,
  Loading,
  Location,
  LocationUpdate,
  Samples,
  SamplesProps,
  Secchi,
  Section,
  StationInfo,
  Weather
} from 'components'
import { DROP_FRAME_STORE, SAMPLE_STORE, STATION_STORE } from 'db'
import { useStation } from 'hooks'
import { Secchi as SecchiModel, Station } from 'models'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Form } from 'reactstrap'

const secchiComplete = (secchi: SecchiModel) => false

interface SecchiSectionProps {
  station: Station
  setStation: React.Dispatch<React.SetStateAction<Station>>
  className?: string
}

const SecchiSection = ({
  station,
  setStation,
  className
}: SecchiSectionProps) => {
  return (
    <Section title="Secchi Drop" complete={secchiComplete(station.secchi)}>
      <div className="px-3">
        <Secchi
          secchi={station.secchi}
          setSecchi={(secchi) => setStation({ ...station, secchi })}
        />
      </div>
    </Section>
  )
}

interface CollapseSampleProps extends SamplesProps {
  className?: string
}

const CollapseSamples = ({
  className,
  samples,
  onCreate
}: CollapseSampleProps) => {
  return (
    <Section title="Indicator Sample" complete={false} className={className}>
      <Samples samples={samples} onCreate={onCreate} />
    </Section>
  )
}

interface FramesProps {
  className?: string
  station: Station
  onCreate: (e: React.MouseEvent) => any
}

const Frames = ({ className, station, onCreate }: FramesProps) => {
  return (
    <Section title="Drop Frames" complete={false} className={className}>
      <div className="mb-1 mt-2 px-3 d-flex justify-content-between">
        <Button
          color="primary"
          outline={true}
          onClick={onCreate}
          disabled={station.frames.length == 4}
        >
          Add Drop Frame
        </Button>
      </div>
      <DropFrames frames={station.frames} onClick={onCreate} />
    </Section>
  )
}

const SaveAndReturn = ({ tripId }: { tripId: number }) => (
  <div className="px-3 d-flex my-4">
    <Link
      href={{ pathname: '/trips', query: { id: tripId } }}
      as={`/trips?id=${tripId}`}
    >
      <a className="btn btn-success flex-fill">Save and Back to Trip</a>
    </Link>
  </div>
)

interface SettingsProps {
  onDelete: (e: React.MouseEvent) => any
}

const Settings = ({ onDelete }: SettingsProps) => (
  <div className="px-3">
    <Section title="Settings" hideIcon={true}>
      <div className="px-3">
        <div className="my-2">
          <Button
            color="danger"
            onClick={onDelete}
            className="w-100"
            type="button"
          >
            Delete This Station Data
          </Button>
          <small className="text-black-50">
            Remove this station from the trip.
          </small>
        </div>
      </div>
    </Section>
  </div>
)

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

  const createNewDropFrame = async (e: React.MouseEvent) => {
    e.preventDefault()
    const id = await db.put(DROP_FRAME_STORE, {
      stationId: station.id,
      picture: false,
      pictureTakenAt: '',
      sediments: {},
      coverage: '',
      notes: ''
    })
    router.push({
      pathname: '/trips/stations/frames',
      query: { id, i: station.frames.length + 1 }
    })
  }

  const createNewSample = async (e: React.MouseEvent) => {
    e.preventDefault()
    const id = await db.put(SAMPLE_STORE, {
      stationId: station.id,
      units: '',
      picture: false,
      pictureTakenAt: '',
      diseaseCoverage: '',
      shoots: [
        {
          length: '',
          width: '',
          diseaseCoverage: '',
          epiphyteCoverage: ''
        },
        {
          length: '',
          width: '',
          diseaseCoverage: '',
          epiphyteCoverage: ''
        },
        {
          length: '',
          width: '',
          diseaseCoverage: '',
          epiphyteCoverage: ''
        }
      ],
      notes: ''
    })
    router.push({
      pathname: '/trips/stations/samples',
      query: { id }
    })
  }

  const deleteStation = async () => {
    const response = confirm('Are you sure you want to delete this station?')
    if (response) {
      await db.delete(STATION_STORE, station.id)
      router.replace('/')
      router.push({
        pathname: '/trips',
        query: {
          id: station.tripId
        }
      })
    }
  }

  if (error) return <DataError error={error.message} />
  if (loading) return <Loading />
  if (!loading && !station) {
    router.replace('/')
    return null
  }

  return (
    <>
      <BackLink name="Trip" pathname="/trips" id={station.tripId} />
      <Form onSubmit={(e) => e.preventDefault()} className="px-3">
        <StationInfo
          className="border-top border-bottom"
          data={{
            stationId: station.stationId,
            isIndicatorStation: station.isIndicatorStation,
            harbor: station.harbor
          }}
          setData={(data) => setStation({ ...station, ...data })}
        />
        <Location
          location={{
            ...station.location
          }}
          onChange={(location: LocationUpdate) =>
            setStation({ ...station, location })
          }
        />
        <Weather
          weather={station.weather}
          onChange={(weather) => setStation({ ...station, weather })}
        />
        <SecchiSection station={station} setStation={setStation} />
        <Frames station={station} onCreate={createNewDropFrame} />
        {station.isIndicatorStation && (
          <CollapseSamples
            samples={station.samples}
            onCreate={createNewSample}
          />
        )}
      </Form>
      <SaveAndReturn tripId={station.tripId} />
      <Settings onDelete={deleteStation} />
    </>
  )
}
