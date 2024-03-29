import SpotifyWebApi from 'spotify-web-api-node';


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET
});

export default spotifyApi;