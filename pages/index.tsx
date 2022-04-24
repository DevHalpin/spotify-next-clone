import type { NextPage } from 'next'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'

const Home: NextPage = () => {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Next.js Spotify Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Sidebar />
        {/* Center */}
      </main>
      <div>{/*player*/}</div>
    </div>
  )
}

export default Home
