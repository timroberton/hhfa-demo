import Head from 'next/head';
import { NextPage } from "next";
import { Icon2 } from 'components-ui';

const Index: NextPage<{}> = () => {
  return <>

    <Head>
      <title>HHFA Analysis Platform Tutorial</title>
      <link rel="stylesheet" type="text/css" href="/sourcesanspro.css" />
    </Head>

    <div className="w-full h-full font-sourcesanspro overflow-y-auto print:overflow-y-visible print:h-auto">

      <a
        className="px-4 py-2 rounded-md flex bg-blue-800 items-center fixed top-4 right-4 hover:bg-gray-800 cursor-pointer print:hidden shadow-lg"
        href="/"
        target="_blank"
      >
        <div className="text-blue-400 pb-0.5 hidden lg:block mr-2">
          Use the platform
        </div>
        <Icon2 name="chevron-double-right" />
      </a>

      <header className="header bg-gradient-to-br from-blue-800 to-blue-900 text-white">
        <nav className="w-full tex max-w-5xl mx-auto px-10 nav pt-16 pb-12" role="navigation" aria-label="main navigation">
          <h1 className="font-extralight text-4xl antialiased">Harmonized Health Facility Assessment</h1>
          <h4 className="mt-3 font-semibold text-4xl antialiased text-white">Analysis Platform</h4>
          <h4 className="mt-7 antialiased font-book text-blue-200">Tutorial ~ Version 0.1 ~ 31.12.2020</h4>
        </nav>
      </header>

      <main className="w-full max-w-5xl mx-auto px-10 markdown">

        <div className="py-12">
          <iframe src="https://player.vimeo.com/video/488278231" width="100%" height="590px" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
        </div>

      </main>

    </div>

  </>;
}

export default Index;