import { useState } from 'react'
import { Button, Col, Container, Row } from 'reactstrap'
import { version } from '../package.json'
import { Gear } from './Icon'

const Backdrop = ({ onClick }) => (
  <div
    onClick={onClick}
    className="position-fixed"
    style={{
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      backgroundColor: 'rgba(0,0,0,.5)'
    }}
  />
)

const SettingsOpen = () => (
  <Container>
    <Row className="mt-3">
      <Col xs="6">Version</Col>
      <Col xs="6" className="d-flex justify-content-end">
        {version}
      </Col>
    </Row>
    <Row className="mt-3">
      <Col xs="6 d-flex align-items-center">Reload App</Col>
      <Col xs="6" className="d-flex justify-content-end">
        <Button
          color="info"
          onClick={() => window.location.reload()}
          aria-label="Reload"
        >
          Reload
        </Button>
      </Col>
    </Row>
    <Row className="mt-3">
      <Col xs="6">Developed By</Col>
      <Col xs="6" className="d-flex justify-content-end">
        <a href="https://ethanmick.com" target="_blank">
          Ethan Mick
        </a>
      </Col>
    </Row>
  </Container>
)

export const Settings: React.FC<unknown> = () => {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)
  return (
    <>
      {open && <Backdrop onClick={toggle} />}
      <div
        className="position-fixed bg-white"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: open ? '80%' : 60,
          boxShadow: '0 -.125rem .25rem rgba(0,0,0,.1)',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem',
          transition: 'height .4s ease'
        }}
      >
        <Row>
          <Col xs="12" className="d-flex">
            <Button
              aria-label="Open Settings"
              color="link"
              className="flex-fill text-left text-dark"
              onClick={toggle}
            >
              <Gear width="1.5rem" height="1.5rem" />
            </Button>
          </Col>
        </Row>
        {open && <SettingsOpen />}
      </div>
    </>
  )
}
