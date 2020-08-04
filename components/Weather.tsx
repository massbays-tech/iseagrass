import { Weather as WeatherModel } from 'models'

interface Props {
  weather: WeatherModel
}

const RainEffect = () => {}

// widget
export const Weather: React.FC<Props> = ({}: Props) => (
  <div
    style={{ background: 'linear-gradient(90deg, #fcff9e 0%, #c67700 100%)' }}
  >
    <i className="wi wi-day-sunny" />
    <div>Sunny</div>
    <div>82&#176;</div>
    <i className="wi wi-wind towards-313-deg" />
  </div>
)
