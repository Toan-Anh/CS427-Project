import React, {Component} from 'react';
// import Api from './lastfm-api';
import FDG from './FDG';
import DVHelper from './data-vis-helper';

export default class SearchResultItem extends Component {

    constructor(props) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
    }

    onItemClick() {
        // fetch(Api.artist_getSimilar(this.props.artist, this.props.mbid))
        //     .then((response) => response.json())
        //     .then((responseData) => {
        //         // FDG.render(responseData.similarartists.artist);
        //         this.addData(responseData.similarartists.artist);
        //     })
        //     .catch((error) => console.log(error));

        var tmp = new DVHelper();
        tmp.initialize({ name: this.props.artist, mbid: this.props.mbid, image: this.props.avatar }, (data) => {
            console.log(data);
            FDG.render(data);
        });
    }

    render() {
        return (
            <div className="search-result-item" onClick={this.onItemClick}>
                <img src={this.props.avatar} className="avatar" />
                <p className="artist-name">{this.props.artist}</p>
            </div>
        );
    }

};

SearchResultItem.propTypes = {
    avatar: React.PropTypes.string,
    artist: React.PropTypes.string,
};

SearchResultItem.defaultProps = {
};