import 'bootstrap/dist/css/bootstrap.min.css'
import { Layout } from 'components'
import { DatabaseContext } from 'contexts/DatabaseContext'
import { connect, Database } from 'db'
import { IDBPDatabase } from 'idb'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import 'styles/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  const [db, setDB] = useState<IDBPDatabase<Database>>(undefined)
  // Open connection on app initialization
  useEffect(() => {
    connect().then(setDB).catch(alert)
  }, [])
  return (
    <DatabaseContext.Provider value={{ db, setDB }}>
      <Head>
        <title>iSeaGrass</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DatabaseContext.Provider>
  )
}

export default MyApp
