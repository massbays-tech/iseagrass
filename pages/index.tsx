import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Col } from 'reactstrap'
const { displayName } = require('../package.json')
const PWAPrompt = dynamic(() => import('../components/Prompt'), { ssr: false })

export default function Home() {
  const router = useRouter()

  return (
    <>
      <div className="my-3">
        <Col xs="12">
          <img src="/static/mf_logo_blue.png" className="w-100" />
        </Col>
        <Col xs="12" className="mt-3">
          <img src="/static/mb_logo.jpg" className="w-100" />
        </Col>
        <Col>
          <p>
            The Massachusetts Division of Marine Fisheries (MA DMF) and the
            Massachusetts Bays National Estuary Partnership (MassBays) developed
            this web application to facilitate data collection of seagrass
            presence and health by citizen and professional scientists. This app
            is intended to be used alongside the written protocol, available
            here.
          </p>
        </Col>
        <Col xs="12" className="my-3">
          <a
            href="/static/protocol.pdf"
            className="btn btn-info w-100"
            target="_blank"
          >
            View Protocol (PDF)
          </a>
        </Col>
        <Col xs="12" className="my-3">
          <Link href="/trips/list">
            <a className="btn btn-lg btn-primary w-100">Go to your trips</a>
          </Link>
        </Col>
        <Col xs="12" className="my-3">
          <Link href="/data">
            <a className="btn btn-info w-100">Download Trip Data</a>
          </Link>
        </Col>
      </div>
      <PWAPrompt
        timesToShow={3}
        delay={500}
        permanentlyHideOnDismiss={false}
        copyBody={`${displayName} has app functionality. Add it to your home screen to use while offline.`}
      />
    </>
  )
}
