import {
  ReplyIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'
import {
  PauseIcon,
  RewindIcon,
  PlayIcon,
  FastForwardIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid'
import { debounce } from 'lodash'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSongInfo from '../hooks/useSongInfo'
import useSpotify from '../hooks/useSpotify'

export default function Player() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState<any>(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = React.useState(50)
  const songInfo = useSongInfo()

  const fetchCurrentTrack = () => {
    // if (!songInfo) {
    spotifyApi.getMyCurrentPlayingTrack().then((res) => {
      console.log('Now Playing: ', res.body?.item)
      setCurrentTrackId(res.body?.item?.id)

      spotifyApi.getMyCurrentPlaybackState().then((res) => {
        setIsPlaying(res.body?.is_playing)
      })
    })
    // }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((res) => {
      if (res.body?.is_playing) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false)
          })
          .catch((err) => {
            console.log('Something went wrong!', err)
          })
      } else {
        spotifyApi
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((err) => {
            console.log('Something went wrong!', err)
          })
      }
    })
  }

  const debouncedAdjustVolume = React.useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {
        console.log('Something went wrong!', err)
      })
    }, 500),
    []
  )

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentTrack()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album?.images?.[0].url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon
          className="button"
          onClick={() => {
            alert('Not implemented')
          }}
        />
        <RewindIcon
          className="button"
          onClick={() => {
            spotifyApi
              .skipToPrevious()
              .then(() => setTimeout(() => fetchCurrentTrack(), 500))
              .catch((err) => console.log(err))
          }}
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button h-10 w-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />
        )}
        <FastForwardIcon
          className="button"
          onClick={() => {
            spotifyApi
              .skipToNext()
              .then(() => setTimeout(() => fetchCurrentTrack(), 500))
              .catch((err) => console.log(err))
          }}
        />
        <ReplyIcon
          className="button"
          onClick={() => {
            alert('Not implemented')
          }}
        />
      </div>
      {/* Right */}
      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolumeDownIcon
          className="button"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          className="w-14 md:w-28"
          type={'range'}
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  )
}
