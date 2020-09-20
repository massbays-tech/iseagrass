import Link from 'next/link'
import { Container, Navbar as RSNavbar } from 'reactstrap'

export const Navbar: React.FC<unknown> = () => {
  // state - is open
  return (
    <RSNavbar color="primary" dark className="shadow-sm">
      <Container fluid="lg" className="p-0">
        <Link href="/">
          <a className="navbar-brand">
            <img
              src="/static/iseagrass.png"
              width="30"
              height="30"
              className="d-inline-block align-top mr-2 rounded-circle"
              alt=""
              loading="lazy"
              style={{
                backgroundColor: 'white'
              }}
            />
            iSeaGrass
          </a>
        </Link>
      </Container>
    </RSNavbar>
  )
}
