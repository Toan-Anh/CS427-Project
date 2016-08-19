import SearchResultItem from './search-result';
import React, {Component} from 'react';

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            data: [],
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQueryChange = this.handleQueryChange.bind(this);
    }

    componentDidMount() {
    }

    handleSubmit(event) {
        event.preventDefault();
        var query = this.state.query.trim();
        if (!query) {
            return;
        }

        console.log(query);
        this.fetchData(query);
    }

    handleQueryChange(event) {
        this.setState({ query: event.target.value });
    }

    fetchData(query) {
        fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${query}&api_key=6fc8076bbe3f25f01f46f776721ce1f3&format=json`)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    data: responseData.results.artistmatches.artist,
                }, () => console.log(this.state.data));
            });
    }

    render() {
        return (
            <div className="search">
                <form className="search-box" onSubmit={this.handleSubmit}>
                    <i className="fa fa-search search-icon"></i>
                    <input
                        className="form-control search-input"
                        type="text"
                        placeholder="Artist name..."
                        value={this.state.query}
                        onChange={this.handleQueryChange}/>
                </form>

                <div className="search-result" id="search-result">
                    {this.state.data.map((item, index) => {
                        let avaLink = item.image[2]['#text'];
                        if (avaLink === "")
                            avaLink = '../res/unknown.png';

                        return <SearchResultItem avatar={avaLink} artist={item.name} key={index}/>
                    }) }
                </div>
            </div>
        );
    }

};

Search.propTypes = {
};

Search.defaultProps = {
};