import Link from 'next/link'
import { useRouter } from 'next/router'
import { AlertCircle } from './Icon'

interface DataErrorProps {
  error: string
}
export const DataError = ({ error }: DataErrorProps) => {
  const router = useRouter()

  return (
    <div className="mt-5 d-flex flex-column align-items-center">
      <AlertCircle width="5rem" height="5rem" className="text-danger" />
      <div className="mt-1">{error}</div>
      <Link href="/" as="/">
        <a>Return to Home</a>
      </Link>
    </div>
  )
}
