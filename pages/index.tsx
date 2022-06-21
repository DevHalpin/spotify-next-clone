import type { NextPage } from 'next'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'
import { getSession, GetSessionParams } from 'next-auth/react'

const Home: NextPage = () => {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Next.js Spotify Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      <div>{/*player*/}</div>
    </div>
  )
}

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context)
  return {
    props: {
      session,
    },
  }
}

export default Home
