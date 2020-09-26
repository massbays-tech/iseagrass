import { Navbar } from './Navbar'

interface Props {
  children?: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }: Props) => (
  <>
    <Navbar />
    <main className="container-lg px-0 pb-5">{children}</main>
  </>
)
