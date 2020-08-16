import { Secchi as SecchiModel, SecchiDrop as SecchiDropModel } from 'models'
import { useEffect } from 'react'
import { FormGroup, Input, Label } from 'reactstrap'
import { UnitInput } from './UnitInput'

interface SecchiDropProps {
  i: number
  drop: SecchiDropModel
  onChange: (drop: SecchiDropModel) => void
}

export const SecchiDrop = ({ i, onChange, drop }: SecchiDropProps) => {
  const onUnitChange = () => {
    const units = {
      ft: 'm',
      m: 'ft'
    }
    onChange({
      ...drop,
      unit: units[drop.unit]
    })
  }
  return (
    <FormGroup className="form-row">
      <div className="col-6">
        <Label for={`secchi-drop-${i}`}>Secchi Depth {i + 1}</Label>
        <UnitInput
          unit={drop.unit}
          onUnitChange={onUnitChange}
          type="number"
          id={`secchi-drop-${i}`}
          required
          inputMode="decimal"
          value={drop.depth}
          onChange={(e) =>
            onChange({
              ...drop,
              depth: e.target.value
            })
          }
        />
      </div>
      <div className="col-6 align-items-end mb-2 d-flex justify-content-end">
        <Label className="mb-0">
          Hit Bottom?
          <input
            className="ml-3"
            type="checkbox"
            style={{ height: 25, width: 25 }}
            checked={drop.hitBottom}
            onChange={(e) =>
              onChange({
                ...drop,
                hitBottom: e.target.checked
              })
            }
          />
        </Label>
      </div>
    </FormGroup>
  )
}

interface Props {
  secchi: SecchiModel
  setSecchi: (s: SecchiModel) => void
  className?: string
}

export const Secchi: React.FC<Props> = ({
  secchi,
  setSecchi,
  className
}: Props) => {
  useEffect(() => {
    if (!secchi.time) {
      const now = new Date()
      const time = `${now
        .getHours()
        .toString()
        .padStart(2, '0')}:${now.getMinutes()}`
      setSecchi({
        ...secchi,
        time
      })
    }
  }, [secchi.time])
  const onUnitChange = () => {
    const units = {
      ft: 'm',
      m: 'ft'
    }
    setSecchi({
      ...secchi,
      unit: units[secchi.unit]
    })
  }
  return (
    <div className="py-2">
      <FormGroup>
        <Label for="depth">Water Depth</Label>
        <UnitInput
          unit={secchi.unit}
          onUnitChange={onUnitChange}
          type="number"
          id="depth"
          required
          value={secchi.depth}
          onChange={(e) =>
            setSecchi({
              ...secchi,
              depth: e.target.value
            })
          }
        />
        <small className="form-text text-muted">
          Click the unit to change it.
        </small>
      </FormGroup>
      <FormGroup>
        <Label for="time">Time</Label>
        <Input
          type="time"
          id="time"
          required
          value={secchi.time}
          onChange={(e) =>
            setSecchi({
              ...secchi,
              time: e.target.value
            })
          }
        />
      </FormGroup>
      {secchi.drops.map((drop, i) => (
        <SecchiDrop
          key={i}
          i={i}
          drop={drop}
          onChange={(drop) => {
            const drops = [...secchi.drops] // copy array
            drops[i] = drop
            setSecchi({
              ...secchi,
              drops
            })
          }}
        />
      ))}
      <FormGroup>
        <Label for="notes">Notes</Label>
        <Input
          type="textarea"
          id="notes"
          value={secchi.notes}
          onChange={(e) =>
            setSecchi({
              ...secchi,
              notes: e.target.value
            })
          }
        />
      </FormGroup>
    </div>
  )
}
