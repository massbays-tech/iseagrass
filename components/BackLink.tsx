import Link from 'next/link'
import { ChevronLeft } from './Icon'

interface Props {
  name: string
  pathname: string
  hash?: string
  id?: number
}

export const BackLink = ({ name, pathname, hash, id }: Props) => {
  const href = id ? { pathname, query: { id }, hash } : { pathname, hash }
  const as = id ? `${pathname}?id=${id}${hash ?? ''}` : pathname + (hash ?? '')
  return (
    <div className="py-2">
      <Link href={href} as={as}>
        <a className="d-flex align-items-center ml-2">
          <ChevronLeft />
          <span>Save and Back to {name}</span>
        </a>
      </Link>
    </div>
  )
}
