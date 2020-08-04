import { ChevronRight } from 'components/Icon'
import { DropFrame } from 'models'
import Link from 'next/link'
import { Button, ListGroup } from 'reactstrap'

interface FrameItemProps {
  frame: DropFrame
}

const FrameItem: React.FC<FrameItemProps> = ({ frame }: FrameItemProps) => {
  return (
    <li className="list-group-item">
      <Link
        href={{
          pathname: '/trips/stations/frames',
          query: { id: frame.id }
        }}
        as={`/trips/stations/frames?id=${frame.id}`}
      >
        <a className="text-dark d-flex justify-content-between align-items-center">
          <div>
            <div>Drop Frame {frame.id}</div>
          </div>
          <ChevronRight />
        </a>
      </Link>
    </li>
  )
}

interface FrameProps {
  frames: DropFrame[]
  onClick: (e: React.MouseEvent) => any
}

export const DropFrames: React.FC<FrameProps> = ({
  frames,
  onClick
}: FrameProps) => {
  if (!frames || frames.length == 0) {
    return <BlankSlate onClick={onClick} />
  }
  return (
    <>
      <ListGroup flush>
        {frames.map((f, key) => (
          <FrameItem frame={f} key={key} />
        ))}
      </ListGroup>
    </>
  )
}

interface BlankSlateProps {
  onClick: (e: React.MouseEvent) => any
}

const BlankSlate: React.FC<BlankSlateProps> = ({
  onClick
}: BlankSlateProps) => (
  <div className="bg-light p-5 text-center">
    <div style={{ fontSize: '1.25rem' }}>No Drop Frames</div>
    <Button onClick={onClick} color="link">
      Add Drop Frame
    </Button>
  </div>
)
