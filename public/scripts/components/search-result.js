import React, {Component} from 'react';

export default class SearchResultItem extends Component {

    constructor(props) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
    }

    onItemClick() {
        alert(`${this.props.artist}`);
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



class SearchResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${this.props.query}&api_key=6fc8076bbe3f25f01f46f776721ce1f3&format=json`)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    data: responseData.results.artistmatches.artist,
                }, () => console.log(this.state.data));
            });
    }

    render() {
        return (
            <div>
                {this.state.data.map((item, index) => {
                    let avaLink = item.image[2]['#text'];
                    if (avaLink === "")
                        avaLink = '../res/unknown.png';

                    return <SearchResultItem avatar={avaLink} artist={item.name} key={index}/>
                }) }
            </div>
        );
    }

};

SearchResult.propTypes = {
    query: React.PropTypes.string,
};

SearchResult.defaultProps = {
};


// ReactDOM.render(
//     <SearchResult query="florence + the machine" />,
//     document.getElementById('search-result')
// );