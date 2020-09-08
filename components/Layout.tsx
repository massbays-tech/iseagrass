import { Container } from 'reactstrap'
import { Navbar } from './Navbar'

interface Props {
  children?: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }: Props) => (
  <>
    <Navbar />
    <Container fluid="lg" className="px-0 pb-5">
      {children}
    </Container>
  </>
)
