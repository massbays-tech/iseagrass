import Link from 'next/link'

export default function Secchi() {
  return (
    <div>
      Secchi page, offline mode?
      <Link href="/trip">
        <a>Trip</a>
      </Link>
    </div>
  )
}
