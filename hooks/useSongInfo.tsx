import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentTrackIdState } from '../atoms/songAtom'
import useSpotify from './useSpotify'

interface ISongInfo {
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

export default function useSongInfo() {
  const spotifyApi = useSpotify()
  const currentTrack = useRecoilValue(currentTrackIdState)
  const [songInfo, setSongInfo] = useState<ISongInfo | null>(null)

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrack) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrack}`,
          {
            headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` },
          }
        ).then((res) => res.json())

        setSongInfo(trackInfo)
      }
    }

    fetchSongInfo()
  }, [currentTrack, spotifyApi])
  return songInfo
}
