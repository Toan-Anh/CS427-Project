'use strict'
import Api from './lastfm-api';

const MAX_DEPTH = 3;
const N_SIMILAR = 5;

export default class DVHelper {
    constructor() {
        this.data = {
            vertices: [],
            edges: [],
            maxConnection: 0,
        }

        this.max = 0;
        this.count = 0;
        for (let i = 0; i < MAX_DEPTH; ++i) {
            this.max += Math.pow(N_SIMILAR, i);
        }
        this.tmp = {};
        this.onDone = null;
    }

    initialize(artist, callback) {
        this.clearData();
        this.onDone = callback;
        this.tmp[artist.name] = {
            connection: 0,
            image: artist.image,
            mbid: artist.mbid
        };
        this.getSimilarArtists(artist.name, artist.mbid, 0);
    }

    // Recursive function
    getSimilarArtists(name, mbid, depth) {
        if (depth >= MAX_DEPTH)
            return;

        fetch(Api.artist_getSimilar(name, mbid))
            .then((response) => response.json())
            .then((responseData) => {
                if (!responseData.similarartists) {
                    this.count += 1;
                    if (this.count === this.max)
                        this.finalize();
                    return;
                }

                let similarArtists = responseData.similarartists.artist;

                // console.log(name, mbid);
                for (let i = 0; i < N_SIMILAR; ++i) {
                    this.addData({ name, mbid }, similarArtists[i]);
                    this.getSimilarArtists(similarArtists[i].name, similarArtists[i].mbid, depth + 1);
                }

                this.count += 1;
                if (this.count === this.max)
                    this.finalize();
            })
            .catch((error) => alert(error));
    }

    finalize() {
        this.data.vertices = Object.keys(this.tmp).map((key, index) => {
            return {
                id: key,
                connection: this.tmp[key].connection,
                image: this.tmp[key].image,
                mbid: this.tmp[key].mbid,
            }
        });
        console.log("Done");
        if (this.onDone)
            this.onDone(this.data);
    }

    addData(source, target) {
        this.data.edges.push({
            source: source.name,
            target: target.name,
            match: parseFloat(target.match),
        });

        this.tmp[source.name].connection += 1;

        if (!this.tmp[target.name]) {
            this.tmp[target.name] = {
                connection: 1,
                image: target.image[2]['#text'],
                mbid: target.mbid,
            };
        }
        else {
            this.tmp[target.name].connection += 1;
        }
        
        var max = Math.max(this.tmp[source.name].connection, this.tmp[target.name].connection)
        this.data.maxConnection = Math.max(this.data.maxConnection, max);
    }

    clearData() {
        this.data = {
            vertices: [],
            edges: [],
            maxConnection: 0,
        };
    }
}