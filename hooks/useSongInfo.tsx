import { useCallback, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSpotify from './useSpotify'

interface ISongInfo {
  id: string
  album: {
    images: {
      url: string
    }[]
  }
  artists: {
    name: string
  }[]
  name: string
}

export default function useSongInfo(currentTrack: string) {
  const spotifyApi = useSpotify()
  const [songInfo, setSongInfo] = useState<ISongInfo | null>(null)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const fetchCurrentTrack = useCallback(() => {
    if (spotifyApi.getAccessToken() === null) return

    spotifyApi.getMyCurrentPlayingTrack().then((res) => {
      if (res.body === null) {
        console.log("No info returned for current track, do we have an active device?") 
        return
      }
      console.log('Song Info', songInfo)
      setIsPlaying(res.body.is_playing)
      if (res.body.item === null) return
      console.log('Spotify', res.body.item)
      if (songInfo?.id !== res.body.item.id) {
        setSongInfo(res.body.item as SpotifyApi.TrackObjectFull)
      }
    })
  }, [spotifyApi, setIsPlaying, songInfo])

  const play = () => setIsPlaying(true)
  const pause = () => setIsPlaying(false)

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Syncing devices...')
      fetchCurrentTrack()
    }, 5000)

    if (songInfo === null) {
      fetchCurrentTrack()
    }

    return () => clearInterval(interval)
  }, [spotifyApi, fetchCurrentTrack, songInfo])

  const refresh = fetchCurrentTrack

  return { details: songInfo, isPlaying, play, pause, refresh }
}
