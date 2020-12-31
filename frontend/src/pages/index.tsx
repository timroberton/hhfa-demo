import Head from 'next/head';
import { NextPage } from "next";
import App from '../content/app';

interface IndexProps { }

const Index: NextPage<IndexProps> = () => {
  return <>

    <Head>
      <title>HHFA Analysis Platform</title>
      <link rel="stylesheet" type="text/css" href="/sourcesanspro.css" />
    </Head>

    <App />

  </>;
}

export default Index;