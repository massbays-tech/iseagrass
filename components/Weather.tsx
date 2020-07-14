import { Weather as WeatherModel } from 'models'
import { Card } from 'reactstrap'

interface Props {
  weather: WeatherModel
}

// widget
export const Weather: React.FC<Props> = ({}: Props) => (
  <>
    <Card>
      <div>Location</div>
      <div>Temperature</div>
      <div>cloud coverage</div>
      <div>wind</div>
    </Card>
  </>
)
