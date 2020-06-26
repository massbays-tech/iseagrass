import { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Eelgrass</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
