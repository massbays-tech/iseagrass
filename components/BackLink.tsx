import Link from 'next/link'
import { ChevronLeft } from './Icon'

interface Props {
  name: string
  pathname: string
  id: number
}

export const BackLink = ({ name, pathname, id }: Props) => (
  <div className="py-2">
    <Link href={{ pathname, query: { id } }} as={`${pathname}?id=${id}`}>
      <a className="d-flex align-items-center ml-2">
        <ChevronLeft />
        <span>Back to {name}</span>
      </a>
    </Link>
  </div>
)
