import Search from './components/search';
import ReactDOM from 'react-dom';
import React from 'react';
import draw from './components/wc';
import lyricsProc from './components/lyrics-fetch-proc';

ReactDOM.render(
    <Search/>,
    document.getElementById('control-pane')
);

lyricsProc.getLyrics('coldplay');