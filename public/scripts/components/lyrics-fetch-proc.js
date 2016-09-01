import Api from './lastfm-api';
import xmlParser from 'xml-parser';
import draw from './wc';
//import lyricsGetter from 'lyric-get';
//var lyrics = require('node-lyrics');

class LyricsHelper {
    constructor() {
        this.nTracks = 10;
        this.count = 0;
        this.omitList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ';', '#', ' ', '&', '\n'];
        this.stopwords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/;
        this.dict = {};
    }
    getLyrics(name, mbid = null) {
        //var stopwordsList = removeStopWords ? this.stopwords.no : this.stopwords.yes;
        //console.log(0);
        fetch(Api.artist_getTopTracks(name, mbid))
            .then((response) => response.json())
            .then((responseData) => {
                //console.log(responseData.toptracks.track[0]);
                if (responseData.toptracks.track.length < this.nTracks) {
                    this.nTracks = responseData.toptracks.track.length;
                }
                console.log(responseData.toptracks.track);
                for (let i = 0; i < this.nTracks; i++) {
                    //console.log(responseData.toptracks.track[i].name);
                    function createCORSRequest(method, url) {
                        let xhr = new XMLHttpRequest();
                        if ("withCredentials" in xhr) {

                            // Check if the XMLHttpRequest object has a "withCredentials" property.
                            // "withCredentials" only exists on XMLHTTPRequest2 objects.
                            xhr.open(method, url, true);

                        } else if (typeof XDomainRequest != "undefined") {

                            // Otherwise, check if XDomainRequest.
                            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
                            xhr = new XDomainRequest();
                            xhr.open(method, url);

                        } else {

                            // Otherwise, CORS is not supported by the browser.
                            xhr = null;

                        }
                        return xhr;
                    }

                    let url = `http://api.lololyrics.com/0.5/getLyric?artist=${name}&track=${responseData.toptracks.track[i].name}&rawutf8=1`;
                    let xhr = createCORSRequest('GET', url);
                    let that = this;
                    xhr.onload = function () {
                        //console.log(xhr.response.getElementsByTagName('response')[0].nodeValue);
                        //console.log(xhr);
                        //console.log(xmlParser(xhr.response).root.children[0].content);
                        if (xmlParser(xhr.response).root.children[0].content === 'OK') {
                            //console.log(that.omitList);
                            let x = xmlParser(xhr.response).root.children[1].content;
                            for (let i = 0; i < x.length; i++) {
                                if (i < x.length && that.omitList.indexOf(x[i]) > -1) {
                                    i++;
                                }
                                if (i >= x.length) {
                                    break;
                                }
                                let a = '';
                                while (i < x.length && that.omitList.indexOf(x[i]) <= -1) {
                                    a += x[i];
                                    i++;
                                }
                                if (a != '') {
                                    let a1 = a.toLowerCase();
                                    that.dict[a1] ? that.dict[a1] += 1 : that.dict[a1] = 1;
                                }
                            }
                            that.count += 1;
                            if (that.count === that.nTracks) {
                                return that.getRemovedStopwordsList(that);
                            }
                        }
                        else {
                            that.count += 1;
                            if (that.count === that.nTracks) {
                                return that.getRemovedStopwordsList(that);
                            }
                        }
                    };
                    xhr.onerror = function () {
                        console.log('There was an error!');
                        that.count += 1;
                        if (that.count === that.nTracks) {
                            return that.getRemovedStopwordsList(that);
                        }
                    };
                    xhr.send();
                }
            });
    }
    getRemovedStopwordsList(that) {
        let finalList = [];
        let maxCount = -1;
        for (let key in that.dict) {
            if (that.dict[key] > maxCount) {
                maxCount = that.dict[key];
            }
        }
        console.log('maxcount ' + maxCount);
        for (let key in that.dict) {
            if (!that.stopwords.test(key)) {
                finalList.push({ "text": key, "size": Math.ceil((200.0 / maxCount) * that.dict[key]) });
                //console.log(finalList);
            }
        }
        console.log(finalList);
        draw(finalList);
        //return finalList;
    }

    getNonRemovedStopwordsList() {
        var finalList = [];
        for (key in this.dict) {
            finalList.push({ "text": key, "size": this.dict[key] });
        }
        return finalList;
    }
}

export default new LyricsHelper();