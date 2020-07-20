import Link from 'next/link'
import { Container, Navbar as RSNavbar } from 'reactstrap'

export const Navbar: React.FC<unknown> = () => {
  // state - is open
  return (
    <RSNavbar color="primary" dark className="shadow-sm">
      <Container className="p-0">
        <Link href="/">
          <a className="navbar-brand">
            <img
              src="/static/seegrass.png"
              width="30"
              height="30"
              className="d-inline-block align-top mr-2"
              alt=""
              loading="lazy"
            />
            SeeGrass
          </a>
        </Link>
      </Container>
    </RSNavbar>
  )
}
