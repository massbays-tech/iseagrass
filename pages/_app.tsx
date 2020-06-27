import 'bootstrap/dist/css/bootstrap.min.css'
import { Layout } from 'components'
import { DBContext } from 'contexts/useDatabase'
import { connect, Database } from 'db'
import { IDBPDatabase } from 'idb'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import 'styles/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  const [db, setDB] = useState<IDBPDatabase<Database>>(undefined)
  // Open connection on app initialization
  useEffect(() => {
    connect().then(setDB)
  }, [])
  return (
    <DBContext.Provider value={{ db, setDB }}>
      <Head>
        <title>Eelgrass</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DBContext.Provider>
  )
}

export default MyApp
