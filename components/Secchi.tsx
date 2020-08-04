import { SecchiDrop as SecchiDropModel, Station } from 'models'
import { useEffect } from 'react'
import { FormGroup, Input, Label } from 'reactstrap'

interface SecchiDropProps {
  i: number
  drop: SecchiDropModel
  onChange: (drop: SecchiDropModel) => void
}

export const SecchiDrop = ({ i, onChange, drop }: SecchiDropProps) => (
  <FormGroup className="form-row">
    <div className="col-6">
      <Label for={`secchi-drop-${i}`}>Secchi Depth {i}</Label>
      <Input
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
      <Label check className="mr-3">
        Hit Bottom?
      </Label>
      <input
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
    </div>
  </FormGroup>
)

interface Props {
  station: Station
  setStation: React.Dispatch<React.SetStateAction<Station>>
}

export const Secchi: React.FC<Props> = ({ station, setStation }: Props) => {
  useEffect(() => {
    if (!station.secchi.time) {
      const now = new Date()
      const time = `${now.getHours()}:${now.getMinutes()}`
      setStation({
        ...station,
        secchi: { ...station.secchi, time }
      })
    }
  }, [station.secchi.time])
  return (
    <div className="py-2">
      <h4 className="font-weight-light">Secchi Info</h4>
      <FormGroup>
        <Label for="depth">Water Depth</Label>
        <Input
          type="number"
          id="depth"
          required
          value={station.secchi.depth}
          onChange={(e) =>
            setStation({
              ...station,
              secchi: { ...station.secchi, depth: e.target.value }
            })
          }
        />
      </FormGroup>
      <FormGroup>
        <Label for="time">Time</Label>
        <Input
          type="time"
          id="time"
          required
          value={station.secchi.time}
          onChange={(e) =>
            setStation({
              ...station,
              secchi: { ...station.secchi, time: e.target.value }
            })
          }
        />
      </FormGroup>
      {station.secchi.drops.map((drop, i) => (
        <SecchiDrop
          key={i}
          i={i}
          drop={drop}
          onChange={(drop) => {
            const drops = [...station.secchi.drops] // copy array
            drops[i] = drop
            setStation({
              ...station,
              secchi: {
                ...station.secchi,
                drops
              }
            })
          }}
        />
      ))}
      <FormGroup>
        <Label for="notes">Notes</Label>
        <Input
          type="textarea"
          id="notes"
          value={station.secchi.notes}
          onChange={(e) =>
            setStation({
              ...station,
              secchi: { ...station.secchi, notes: e.target.value }
            })
          }
        />
      </FormGroup>
    </div>
  )
}
