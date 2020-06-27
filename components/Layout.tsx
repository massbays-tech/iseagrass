import { Container } from 'reactstrap'
import { Navbar } from './Navbar'

interface Props {
  children?: React.ReactNode
}

export const Layout = ({ children }: Props) => (
  <>
    <Navbar />
    <Container>{children}</Container>
  </>
)
