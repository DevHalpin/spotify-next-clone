import React from 'react'
import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import Song from './Song'

interface Track {
  track: {
    duration_ms: number
    id: string
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

export default function Songs() {
  const playlist = useRecoilValue<any>(playlistState)
  return (
    <div className="flex flex-col space-y-1 px-8 text-white">
      {playlist?.tracks.items.map((track: Track, index: number) => (
        <Song key={track.track.id} track={track} order={index} />
      ))}
    </div>
  )
}
