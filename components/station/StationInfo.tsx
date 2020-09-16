import { FormGroup, Input, Label } from 'reactstrap'
import { Section, Toggle } from './Section'

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
  toggle: Toggle
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
      id="station-info"
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
          <div className="col-6 align-items-end d-flex justify-content-end">
            <label className="d-flex flex-fill justify-content-end align-items-center form-check-label mb-2">
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
            </label>
            <style jsx>{`
              @media (max-width: 379px) {
                label {
                  margin-bottom: 0px !important;
                }
              }
            `}</style>
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
