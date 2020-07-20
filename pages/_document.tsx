import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="apple-touch-startup-image" href="/launch.png" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="SeeGrass" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
