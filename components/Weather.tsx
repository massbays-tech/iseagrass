import { Weather as WeatherModel } from 'models'
import { useState } from 'react'
import { Col, Collapse, CustomInput, FormGroup, Label, Row } from 'reactstrap'
import { ChevronRight } from './Icon'

const Backgrounds = {
  unknown: 'linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)'
}

interface WeatherProp {
  value: string
  onChange: (e: any) => void
}

export const CloudCoverage = ({ value, onChange }: WeatherProp) => (
  <FormGroup>
    <Label for="cloud-coverage">Cloud Coverage</Label>
    <CustomInput
      type="select"
      id="cloud-coverage"
      name="cloud-coverage"
      value={value}
      onChange={onChange}
    >
      {['0%', '1% - 25%', '26% - 50%', '51% - 100%'].map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </CustomInput>
  </FormGroup>
)

interface Props {
  weather: WeatherModel
  onChange: (weather: WeatherModel) => void
}

export const Weather: React.FC<Props> = ({ weather }: Props) => {
  // const { loading, weather, error } = useWeather()
  const [open, setOpen] = useState(false)

  const background = Backgrounds['unknown']
  const toggle = () => {
    setOpen(!open)
  }
  return (
    <Row className="border-top border-bottom" style={{ background }}>
      <Col
        xs="12"
        className="d-flex align-items-center justify-content-start"
        onClick={toggle}
      >
        <h4 className="font-weight-light my-2">Weather</h4>
        <span className="flex-fill" />
        <ChevronRight
          style={{
            transform: `rotate(${open ? '90' : '0'}deg)`,
            transition: '.35s ease'
          }}
        />
      </Col>
      <Collapse isOpen={open} className="w-100 pb-3">
        <div className="px-3">
          <CloudCoverage value={weather.clouds} onChange={() => {}} />
        </div>
      </Collapse>
    </Row>
  )
}

//       <i className="wi wi-wind towards-313-deg" />
