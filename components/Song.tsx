import React from 'react'
import { useRecoilState } from 'recoil'
import useSpotify from '../hooks/useSpotify'
import { millisToMinutesAndSeconds } from '../lib/time'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import { playlistState, playlistIdState } from '../atoms/playlistAtom'

interface trackProps {
  track: {
    uri: string
    id: string
    duration_ms: number
    artists: {
      name: string
    }[]
    name: string
    album: {
      name: string
      images: {
        url: string
      }[]
    }
    track: {
      id: string
      name: string
    }
  }
}

export default function Song({
  track,
  order,
}: {
  track: trackProps
  order: number
}) {
  const spotifyApi = useSpotify()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState<any>(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const playSong = () => {
    setCurrentTrackId(track.track.id)
    setIsPlaying(true)
    spotifyApi
      .play({
        uris: [track.track.uri],
      })
      .catch((err) => {
        console.log('Something went wrong!', err)
      })
  }
  return (
    <div
      className="grid cursor-pointer grid-cols-2 rounded-lg py-4 px-5 text-gray-500 hover:bg-gray-900"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track.track.album.images[0].url}
          alt=""
        />
        <div>
          <p className="w-36 truncate text-white lg:w-64">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="hidden w-40 md:inline">{track.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  )
}
