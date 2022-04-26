import { ChevronDownIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'

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

  useEffect(() => {
    const randomColor = shuffle(colors).pop()

    setColor(randomColor!)
  }, [])

  return (
    <div className="flex-grow text-white">
      <header className="absolute top-5 right-8">
        <div className="padding-1 flex cursor-pointer items-center space-x-3 rounded-full bg-black pr-2 opacity-90 hover:opacity-80">
          <img
            className="h-10 w-10 rounded-full"
            src={session?.user!.image ? session?.user!.image : '/nopic.png'}
            alt=""
          />
          <h2>{session?.user!.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`padding-8 flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-black text-white`}
      >
        <h1>Hello</h1>
      </section>
    </div>
  )
}

export default Center
