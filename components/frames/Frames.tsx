import { FlexFill } from 'components/FlexFill'
import { Check, ChevronRight, Circle } from 'components/Icon'
import { DropFrame, frameSediments, validDropFrame } from 'models'
import Link from 'next/link'
import { Button, ListGroup } from 'reactstrap'

interface FrameItemProps {
  i: number
  frame: DropFrame
}

const FrameItem: React.FC<FrameItemProps> = ({ i, frame }: FrameItemProps) => {
  const sediments = frameSediments(frame)
  return (
    <li className="list-group-item">
      <Link
        href={{
          pathname: '/trips/stations/frames',
          query: { id: frame.id, i }
        }}
        as={`/trips/stations/frames?id=${frame.id}&i=${i}`}
      >
        <a className="text-dark d-flex justify-content-start align-items-center">
          {validDropFrame(frame) ? (
            <Check width=".75rem" height=".75rem" className="text-success" />
          ) : (
            <Circle width=".75rem" height=".75rem" />
          )}
          <div className="ml-3">
            <div>Drop Frame {i + 1}</div>
            <small className="text-black-50">
              {frame.coverage ? (
                <>{frame.coverage} coverage</>
              ) : (
                <span className="text-danger">Missing Coverage</span>
              )}{' '}
              &bull;{' '}
              {sediments.length == 0 ? (
                'No sediment'
              ) : (
                <>{frameSediments(frame).join(', ')}</>
              )}
            </small>
          </div>
          <FlexFill />
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
        {frames.map((f, i) => (
          <FrameItem frame={f} key={i} i={i} />
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
    <Button onClick={onClick} color="link" aria-label="Add Drop Frame">
      Add Drop Frame
    </Button>
  </div>
)
