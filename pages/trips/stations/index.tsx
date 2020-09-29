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
  Toggle,
  Weather
} from 'components'
import { DROP_FRAME_STORE, SAMPLE_STORE, STATION_STORE } from 'db'
import { useStation } from 'hooks'
import { filter } from 'lodash'
import {
  DropFrame,
  hasEelgrass,
  Station,
  UIStationPage,
  validDropFrame,
  validSample,
  validSecchi
} from 'models'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Button, Form } from 'reactstrap'
import { parse } from 'url'

interface SecchiSectionProps {
  station: Station
  setStation: React.Dispatch<React.SetStateAction<Station>>
  className?: string
  open: boolean
  toggle: Toggle
}

const SecchiSection = ({
  open,
  toggle,
  station,
  setStation,
  className
}: SecchiSectionProps) => {
  return (
    <Section
      title="Secchi Drop"
      id="secchi"
      complete={validSecchi(station.secchi)}
      open={open}
      toggle={toggle}
    >
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
  frames: DropFrame[]
  className?: string
  open: boolean
  toggle: Toggle
  passRef: any
}

const CollapseSamples = ({
  frames,
  className,
  samples,
  onCreate,
  open,
  passRef,
  toggle
}: CollapseSampleProps) => {
  const framesWith = frames.filter(hasEelgrass)
  const complete = filter(samples, validSample).length == framesWith.length
  return (
    <Section
      title={`Indicator Sample ${samples.length}/${framesWith.length}`}
      complete={complete}
      className={className}
      id="indicator-samples"
      open={open}
      toggle={toggle}
      passRef={passRef}
    >
      <Samples
        disableCreate={samples.length >= framesWith.length}
        samples={samples}
        onCreate={onCreate}
      />
    </Section>
  )
}

interface FramesProps {
  className?: string
  station: Station
  onCreate: (e: React.MouseEvent) => any
  open: boolean
  toggle: Toggle
  passRef: any
}

const Frames = ({
  open,
  toggle,
  className,
  station,
  onCreate,
  passRef
}: FramesProps) => {
  const REQUIRED_STATIONS = 4
  const complete = filter(station.frames, validDropFrame).length
  const isComplete = complete == REQUIRED_STATIONS
  return (
    <Section
      passRef={passRef}
      title={`Drop Frames ${complete}/${REQUIRED_STATIONS}`}
      complete={isComplete}
      className={className}
      id="drop-frames"
      open={open}
      toggle={toggle}
    >
      <div className="mb-1 mt-2 px-3 d-flex justify-content-between">
        <Button
          aria-label="Add Drop Frame"
          color="primary"
          outline={true}
          onClick={onCreate}
          disabled={station.frames.length == REQUIRED_STATIONS}
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

const Settings = ({ onDelete }: SettingsProps) => {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)
  return (
    <div className="px-3">
      <Section
        title="Settings"
        hideIcon={true}
        open={open}
        toggle={toggle}
        id="settings"
      >
        <div className="px-3">
          <div className="my-2">
            <Button
              aria-label="Delete This Station Data"
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
}

const Index = () => {
  const router = useRouter()
  const { loading, db, value, error } = useStation()
  const [station, setStation] = useState<Station>(undefined)
  const scrollDown = (check: string) => (ref: any) => {
    const { hash } = parse(router.asPath)
    if (ref && check == hash) {
      ref.scrollIntoView()
    }
  }
  const framesRef = useCallback(scrollDown('#drop-frames'), [])
  const samplesRef = useCallback(scrollDown('#indicator-samples'), [])
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
      query: { id, i: station.frames.length }
    })
  }

  const createNewSample = async (e: React.MouseEvent) => {
    e.preventDefault()
    const id = await db.put(SAMPLE_STORE, {
      stationId: station.id,
      picture: false,
      pictureTakenAt: '',
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
      query: { id, i: station.samples.length }
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

  const toggle = (section: keyof UIStationPage) => (e: React.MouseEvent) =>
    setStation({
      ...station,
      $ui: {
        ...station.$ui,
        [section]: !station?.$ui?.[section]
      }
    })

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
          open={station.$ui?.info}
          toggle={toggle('info')}
          className="border-top border-bottom"
          data={{
            stationId: station.stationId,
            isIndicatorStation: station.isIndicatorStation,
            harbor: station.harbor,
            notes: station.notes
          }}
          setData={(data) => setStation({ ...station, ...data })}
        />
        <Location
          open={station.$ui?.location}
          toggle={toggle('location')}
          location={{
            ...station.location
          }}
          onChange={(location: LocationUpdate) =>
            setStation({ ...station, location })
          }
        />
        <Weather
          open={station.$ui?.weather}
          toggle={toggle('weather')}
          weather={station.weather}
          onChange={(weather) => setStation({ ...station, weather })}
        />
        <SecchiSection
          station={station}
          setStation={setStation}
          open={station.$ui?.secchi}
          toggle={toggle('secchi')}
        />
        <Frames
          station={station}
          onCreate={createNewDropFrame}
          open={station.$ui?.frames}
          toggle={toggle('frames')}
          passRef={framesRef}
        />
        {station.isIndicatorStation && (
          <CollapseSamples
            open={station.$ui?.sample}
            toggle={toggle('sample')}
            frames={station.frames}
            samples={station.samples}
            onCreate={createNewSample}
            passRef={samplesRef}
          />
        )}
      </Form>
      <SaveAndReturn tripId={station.tripId} />
      <Settings onDelete={deleteStation} />
    </>
  )
}

export default Index
