import Api from './lastfm-api';
import draw from './wc';

class LyricsHelper {

    constructor() {
        this.wordsLimit = 100;
        this.nTracks = 10;
        this.count = 0;
        this.lyrics = '';
        this.data = [];
        this.onDone = null;
        this.stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall|[0-9]+|oh|ooh|whoa)$/;
        this.separators = /[ \f\n\r\t\v\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g;
        this.punctuations = /[\!-\#\%-\*\,-\/\:\;\?\@\\\[-\\\]\_\{\}\xa1\xa7\xab\xb6\xb7\xbb\xbf\u037e\u0387\u055a-\u055f\u0589\u058a\u05be\u05c0\u05c3\u05c6\u05f3\u05f4\u0609\u060a\u060c\u060d\u061b\u061e\u061f\u066a-\u066d\u06d4\u0700-\u070d\u07f7-\u07f9\u0830-\u083e\u085e\u0964\u0965\u0970\u0af0\u0df4\u0e4f\u0e5a\u0e5b\u0f04-\u0f12\u0f14\u0f3a-\u0f3d\u0f85\u0fd0-\u0fd4\u0fd9\u0fda\u104a-\u104f\u10fb\u1360-\u1368\u1400\u166d\u166e\u169b\u169c\u16eb-\u16ed\u1735\u1736\u17d4-\u17d6\u17d8-\u17da\u1800-\u180a\u1944\u1945\u1a1e\u1a1f\u1aa0-\u1aa6\u1aa8-\u1aad\u1b5a-\u1b60\u1bfc-\u1bff\u1c3b-\u1c3f\u1c7e\u1c7f\u1cc0-\u1cc7\u1cd3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205e\u207d\u207e\u208d\u208e\u2329\u232a\u2768-\u2775\u27c5\u27c6\u27e6-\u27ef\u2983-\u2998\u29d8-\u29db\u29fc\u29fd\u2cf9-\u2cfc\u2cfe\u2cff\u2d70\u2e00-\u2e2e\u2e30-\u2e3b\u3001-\u3003\u3008-\u3011\u3014-\u301f\u3030\u303d\u30a0\u30fb\ua4fe\ua4ff\ua60d-\ua60f\ua673\ua67e\ua6f2-\ua6f7\ua874-\ua877\ua8ce\ua8cf\ua8f8-\ua8fa\ua92e\ua92f\ua95f\ua9c1-\ua9cd\ua9de\ua9df\uaa5c-\uaa5f\uaade\uaadf\uaaf0\uaaf1\uabeb\ufd3e\ufd3f\ufe10-\ufe19\ufe30-\ufe52\ufe54-\ufe61\ufe63\ufe68\ufe6a\ufe6b\uff01-\uff03\uff05-\uff0a\uff0c-\uff0f\uff1a\uff1b\uff1f\uff20\uff3b-\uff3d\uff3f\uff5b\uff5d\uff5f-\uff65]+/g;
    }

    reset() {
        this.nTracks = 10;
        this.count = 0;
        this.lyrics = '';
        this.data = [];
        this.onDone = null;
    }

    _getLyricsFromLyricsWikia(text) {
        let openTagSearch = `<div class='lyricbox'>`;
        let closeTagSearch = `<!--`;
        let start = text.indexOf(openTagSearch);
        let end = text.indexOf(closeTagSearch, start);
        // console.log(start, end, text.substring(start, end));
        let div = document.createElement('div');
        div.innerHTML = text.substring(start, end).replace(/\<br\s*\/\>|\<br\s*\>/g, '&nbsp;') + `</div>`;
        console.log(div.textContent);
        // document.body.appendChild(div);
        return div.textContent;
    }

    getTopTracksLyrics(artist, mbid, callback) {
        this.reset();
        this.onDone = callback;

        fetch(Api.artist_getTopTracks(artist, mbid))
            .then(response => response.json())
            .then(responseData => {
                let topTracks = responseData.toptracks.track;
                if (!topTracks) {
                    console.log(`No top tracks data`);
                    return;
                }

                this.nTracks = Math.min(topTracks.length, this.nTracks);
                for (let i = 0; i < this.nTracks; ++i) {
                    this._getLyrics(artist, topTracks[i].name);
                }
            })
            .catch((error) => console.log(error));
    }

    _getLyrics(artist, track) {
        let url = `https://crossorigin.me/https://lyrics.wikia.com/wiki/${artist.replace(/\s/g, '_')}:${track.replace(/\s/g, '_')}`;
        fetch(encodeURI(url))
            .then(response => response.text())
            .then(text => {
                let responseData = this._getLyricsFromLyricsWikia(text);
                this.count += 1;
                if (responseData.err !== 'none') {
                    this.lyrics += responseData;
                }
                else {
                    console.log();
                }

                if (this.count === this.nTracks) {
                    this._parseLyrics();
                }
            })
            .catch((error) => {
                console.log(error);
                this.count += 1;
                if (this.count === this.nTracks) {
                    this._parseLyrics();
                }
            });
    }

    _parseLyrics() {
        let words = this.lyrics.toLowerCase().split(this.separators);
        let tmp = {};
        let maxCount = 0;

        words.forEach((word) => {
            let term = this.stopWords.test(word) ? null : word;

            if (term) {
                term = term.replace(this.punctuations, '');
                tmp[term] = tmp[term] ? tmp[term] + 1 : 1;
                maxCount = Math.max(tmp[term], maxCount);
            }
        });

        this.data = Object.keys(tmp).map((term) => {
            return {
                text: term,
                size: Math.ceil((tmp[term]) * (50 / maxCount) + 16),
            }
        });

        this.data = this.data.sort((lhs, rhs) => rhs.size - lhs.size).slice(0, this.wordsLimit);

        this.onDone(this.data);
    }

}

export default new LyricsHelper();