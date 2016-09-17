const ROOT_URL = 'https://ws.audioscrobbler.com/2.0/';
const API_KEY = '6fc8076bbe3f25f01f46f776721ce1f3';

export default {
    artist_search(name) {
        return `${ROOT_URL}?method=artist.search&artist=${name}&api_key=${API_KEY}&format=json`;
    },

    artist_getInfo(name, mbid = null) {
        return `${ROOT_URL}?method=artist.getinfo&artist=${name}&mbid=${mbid ? mbid : ''}&api_key=${API_KEY}&format=json`;
    },

    artist_getSimilar(name, mbid = null) {
        return `${ROOT_URL}?method=artist.getsimilar&artist=${name}&mbid=${mbid ? mbid : ''}&api_key=${API_KEY}&format=json`;
    },
    
    artist_getTopTracks(name, mbid = null) {
        return `${ROOT_URL}?method=artist.gettoptracks&artist=${name}&mbid=${mbid ? mbid : ''}&api_key=${API_KEY}&format=json`;
    }
}