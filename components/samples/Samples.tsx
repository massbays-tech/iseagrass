import { ChevronRight } from 'components/Icon'
import { Sample } from 'models'
import Link from 'next/link'
import { Button, ListGroup } from 'reactstrap'

interface BlankSlateProps {
  onClick: (e: React.MouseEvent) => any
}

const BlankSlate: React.FC<BlankSlateProps> = ({
  onClick
}: BlankSlateProps) => (
  <div className="bg-light p-5 text-center">
    <div style={{ fontSize: '1.25rem' }}>No Indicator Info</div>
    <Button onClick={onClick} color="link">
      Add
    </Button>
  </div>
)

interface SampleItemProps {
  i: number
  sample: Sample
}

const SampleItem = ({ i, sample }: SampleItemProps) => (
  <li className="list-group-item">
    <Link
      href={{
        pathname: '/trips/stations/samples',
        query: { id: sample.id, i }
      }}
      as={`/trips/stations/samples?id=${sample.id}&i=${i}`}
    >
      <a className="text-dark d-flex justify-content-between align-items-center">
        <div>
          <div>Indicator Info {i + 1}</div>
        </div>
        <ChevronRight />
      </a>
    </Link>
  </li>
)

export const SampleList: React.FC<SamplesProps> = ({
  samples,
  onCreate
}: SamplesProps) => {
  if (!samples || samples.length == 0) {
    return <BlankSlate onClick={onCreate} />
  }
  return (
    <>
      <ListGroup flush>
        {samples.map((s, key) => (
          <SampleItem i={key} sample={s} key={key} />
        ))}
      </ListGroup>
    </>
  )
}

export interface SamplesProps {
  samples: Sample[]
  onCreate: (e: React.MouseEvent) => void
  disableCreate?: boolean
}

export const Samples = ({ disableCreate, samples, onCreate }: SamplesProps) => (
  <>
    <div className="mb-1 mt-2 px-3 d-flex justify-content-between">
      <Button
        color="primary"
        outline={true}
        onClick={onCreate}
        disabled={disableCreate}
      >
        Add Sample
      </Button>
    </div>
    <SampleList samples={samples} onCreate={onCreate} />
  </>
)
