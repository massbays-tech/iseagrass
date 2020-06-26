import Link from 'next/link'

export default function Home() {
  return (
    <>
      <div>Next-Offline Example, try to install app via chrome</div>
      <Link href="/secchi">
        <a>Secchi</a>
      </Link>
    </>
  )
}
