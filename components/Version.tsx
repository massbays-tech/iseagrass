import { Button, Col } from 'reactstrap'

export const Version: React.FC<unknown> = () => (
  <div className="d-flex justify-content-between pt-5">
    <Col xs="3"> {process.env.VERSION}</Col>
    <Col xs="3">
      <Button color="link" onClick={() => window.location.reload(true)}>
        reload
      </Button>
    </Col>
  </div>
)
