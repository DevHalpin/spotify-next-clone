import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  SearchIcon,
} from '@heroicons/react/outline'

const Sidebar = () => {
  return (
    <div className="border-gray-800 p-5 text-sm text-gray-600">
      <div className="space-y-4">
        <button className="flex items-center space-x-4 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-4 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-4 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <br />
        <button className="flex items-center space-x-4 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-4 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <hr className="border-t-[0.1] border-gray-900" />

        <p className="cursor-pointer hover:text-white">Playlist</p>
        <p className="cursor-pointer hover:text-white">Playlist</p>
        <p className="cursor-pointer hover:text-white">Playlist</p>
        <p className="cursor-pointer hover:text-white">Playlist</p>
        <p className="cursor-pointer hover:text-white">Playlist</p>
        <p className="cursor-pointer hover:text-white">Playlist</p>
        <p className="cursor-pointer hover:text-white">Playlist</p>
      </div>
    </div>
  )
}

export default Sidebar
