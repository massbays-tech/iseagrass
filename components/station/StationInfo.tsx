import { FormGroup, Input, Label } from 'reactstrap'
import { Section } from './Section'

export interface StationDetailProps {
  stationId: string
  isIndicatorStation: boolean
  harbor: string
  notes: string
}

interface Props {
  data: StationDetailProps
  setData: (data: StationDetailProps) => void
  className?: string
  open?: boolean
  toggle?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const isDone = (data: StationDetailProps) => data.harbor && data.stationId

export const StationInfo = ({
  open,
  toggle,
  className,
  data,
  setData
}: Props) => {
  const complete = !!data.stationId && !!data.harbor
  return (
    <Section
      title={`Station ${data.stationId}`}
      complete={complete}
      className={className}
      open={open}
      toggle={toggle}
    >
      <div className="px-3">
        <FormGroup className="form-row">
          <div className="col-6">
            <Label for="station">Station ID</Label>
            <Input
              type="text"
              id="station"
              required
              inputMode="text"
              value={data.stationId}
              onChange={(e) => {
                setData({ ...data, stationId: e.target.value })
              }}
            />
          </div>
          <div className="col-6 align-items-end mb-2 d-flex justify-content-end">
            <Label check className="d-flex flex-fill justify-content-end">
              Indicator Station?
              <input
                className="ml-3"
                type="checkbox"
                style={{ height: 25, width: 25 }}
                checked={data.isIndicatorStation}
                onChange={(e) =>
                  setData({
                    ...data,
                    isIndicatorStation: e.target.checked
                  })
                }
              />
            </Label>
          </div>
        </FormGroup>
        <FormGroup>
          <Label for="harbor">Harbor</Label>
          <Input
            type="text"
            id="harbor"
            required={true}
            value={data.harbor}
            onChange={(e) => setData({ ...data, harbor: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="notes">Notes</Label>
          <Input
            type="textarea"
            id="notes"
            value={data.notes}
            onChange={(e) =>
              setData({
                ...data,
                notes: e.target.value
              })
            }
          />
        </FormGroup>
      </div>
    </Section>
  )
}
