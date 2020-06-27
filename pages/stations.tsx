import Link from 'next/link'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'

export default () => {
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  }
  return (
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <Label for="station">Station Number</Label>
        <Input type="number" id="station" required={true} inputMode="decimal" />
      </FormGroup>
      <Row className="justify-content-between">
        <Col xs="auto" className="d-flex align-items-center">
          <Link href="/">
            <a>Cancel</a>
          </Link>
        </Col>
        <Col xs="auto">
          <Button value="submit" color="primary">
            Save and Continue
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
