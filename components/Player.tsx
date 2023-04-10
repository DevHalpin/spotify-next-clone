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
import Image from 'next/image'
import React, { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import { deviceIdState } from '../atoms/deviceAtom'
import useSongInfo from '../hooks/useSongInfo'
import useSpotify from '../hooks/useSpotify'

export default function Player() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState<any>(currentTrackIdState)
  const [deviceId, setDeviceId] = useRecoilState<any>(deviceIdState)

  const [volume, setVolume] = React.useState(50)
  const {
    details: songInfo,
    isPlaying,
    pause,
    play,
    refresh,
  } = useSongInfo(currentTrackId)

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((res) => {
      if (res.body?.is_playing) {
        spotifyApi
          .pause()
          .then(pause)
          .catch((err) => {
            console.log('Something went wrong!', err)
          })
      } else {
        spotifyApi
          .play({ device_id: deviceId || undefined })
          .then(play)
          .catch((err) => {
            console.log('Something went wrong!', err)
          })
      }
    })
  }

  const debouncedAdjustVolume = React.useMemo(
    () =>
      debounce((volume) => {
        spotifyApi.setVolume(volume,{ device_id: deviceId || undefined }).catch((err) => {
          console.log('Something went wrong!', deviceId, err)
        })
      }, 500),
    [spotifyApi]
  )

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume, debouncedAdjustVolume])

  useEffect(() => {
    const getDevice = async () => {
    const {body} = await spotifyApi.getMyDevices()
    const activeDevice = body.devices.find(device => {
      return device.is_active === true})
    setDeviceId(activeDevice? activeDevice.id : body.devices[0].id)  
    }
    getDevice()
  }, [])

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      {/* Left */}
      {songInfo && (
        <div className="flex items-center space-x-4">
          {songInfo.album.images.length > 0 && (
            <Image
              className="hidden md:inline"
              src={songInfo.album.images[0].url}
              alt=""
              width={160}
              height={160}
            />
          )}
          <div>
            <h3>{songInfo.name}</h3>
            <p>{songInfo.artists.length > 0 && songInfo.artists[0].name}</p>
          </div>
        </div>
      )}

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
              .then(() => setTimeout(refresh, 500))
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
              .then(() => setTimeout(refresh, 500))
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
