'use strict'
import Api from './lastfm-api';

const MAX_DEPTH = 3;
const N_SIMILAR = 5;

export default class DVHelper {
    constructor() {
        this.data = {
            vertices: [],
            edges: [],
            maxValue: 0,
        }

        this.max = 0;
        this.count = 0;
        for (let i = 0; i < MAX_DEPTH; ++i) {
            this.max += Math.pow(N_SIMILAR, i);
        }
        this.tmpVertices = {};
        this.tmpEdges = {};
        this.onDone = null;
    }

    initialize(artist, callback) {
        this.clearData();
        this.onDone = callback;
        this.tmpVertices[artist.name] = {
            value: 0,
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
            .catch((error) => {
                alert(error);
                this.count += 1;
                if (this.count === this.max)
                    this.finalize();
            });
    }

    finalize() {
        this.data.vertices = Object.keys(this.tmpVertices).map((key, index) => {
            this.tmpVertices[key]['index'] = index;
            return {
                id: key,
                value: this.tmpVertices[key].value,
                image: this.tmpVertices[key].image,
                mbid: this.tmpVertices[key].mbid,
            }
        });

        this.data.edges = Object.keys(this.tmpEdges).map((key) => {
            return {
                source: this.tmpVertices[this.tmpEdges[key].source].index,
                target: this.tmpVertices[this.tmpEdges[key].target].index,
                value: this.tmpEdges[key].value,
            };
        });
        console.log("Done");
        if (this.onDone)
            this.onDone(this.data);
    }

    addData(source, target) {
        // this.data.edges.push({
        //     source: source.name,
        //     target: target.name,
        //     match: parseFloat(target.match),
        // });


        if (!this.tmpEdges[source.mbid + target.mbid]) {
            this.tmpEdges[source.mbid + target.mbid] = {
                source: source.name,
                target: target.name,
                // match: parseFloat(target.match),
                value: 2,
            }
        }
        else {
            this.tmpEdges[source.mbid + target.mbid].value += 2;
        }

        this.tmpVertices[source.name].value += 1;

        if (!this.tmpVertices[target.name]) {
            this.tmpVertices[target.name] = {
                value: 1,
                image: target.image[2]['#text'],
                mbid: target.mbid,
            };
        }
        else {
            this.tmpVertices[target.name].value += 1;
        }

        var max = Math.max(this.tmpVertices[source.name].value, this.tmpVertices[target.name].value)
        this.data.maxValue = Math.max(this.data.maxValue, max);
    }

    clearData() {
        this.data = {
            vertices: [],
            edges: [],
            maxValue: 0,
        };
    }
}