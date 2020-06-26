import Link from 'next/link'

export default function Weather() {
  return (
    <div>
      Weather, nice, cool.
      <Link href="/">
        <a>AND NOW HOME</a>
      </Link>
    </div>
  )
}
