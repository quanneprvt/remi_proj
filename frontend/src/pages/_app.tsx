import { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "../providers/useSessionProvider";
import "../global.scss";

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title>Test</title>
        <meta name="description" content="test" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App;
