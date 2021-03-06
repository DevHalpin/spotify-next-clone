import { ChevronDownIcon } from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistState, playlistIdState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
import SongList from './SongList'

const colors = [
  'from-red-500',
  'from-orange-500',
  'from-yellow-500',
  'from-green-500',
  'from-blue-500',
  'from-indigo-500',
  'from-violet-500',
]

function Center() {
  const { data: session } = useSession()
  const [color, setColor] = useState('')
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState<any>(playlistState)
  const spotifyApi = useSpotify()

  useEffect(() => {
    const randomColor = shuffle(colors).pop()

    setColor(randomColor!)
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body)
      })
      .catch((error) => console.error('Something went wrong!', error))
  }, [spotifyApi, playlistId])

  return (
    <div className="h-screen flex-grow overflow-y-scroll text-white scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 opacity-90 hover:opacity-80"
          onClick={() => signOut()}
        >
          <img
            className="h-10 w-10 rounded-full"
            src={session?.user!.image ? session?.user.image : '/nopic.png'}
            alt=""
          />
          <h2>{session?.user && session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b p-8 ${color} to-black text-white`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images[0]?.url}
          alt=""
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl">{playlist?.name}</h1>
        </div>
      </section>
      <div>
        <SongList />
      </div>
    </div>
  )
}

export default Center
