import { noop } from 'lodash'
import { useState } from 'react'
import { Input, InputGroup, InputProps } from 'reactstrap'

interface UnitInputProps extends InputProps {
  unit: string
  onUnitChange?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

export const UnitInput = ({
  unit,
  onUnitChange = noop,
  ...props
}: UnitInputProps) => {
  const [i, setIndex] = useState(0)
  return (
    <InputGroup>
      <Input {...props} />
      <div className="input-group-append">
        <span className="input-group-text" onClick={onUnitChange}>
          {unit}
        </span>
      </div>
    </InputGroup>
  )
}
