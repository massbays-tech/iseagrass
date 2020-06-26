import Link from 'next/link'

export default function Trip() {
  return (
    <div>
      TRIP PAGE
      <Link href="/weather">
        <a>weather page, gogogo</a>
      </Link>
    </div>
  )
}
