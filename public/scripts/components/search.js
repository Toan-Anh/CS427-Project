import SearchResultItem from './search-result';
import React, {Component} from 'react';
import Api from './lastfm-api';

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            data: [],
            isLoading: false,
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
        this.setState({ isLoading: true });
        fetch(Api.artist_search(this.state.query))
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    data: responseData.results.artistmatches.artist,
                    isLoading: false,
                });
            })
            .catch((error) => alert(error));
    }

    render() {
        var content = null;
        if (this.state.isLoading)
            content = (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    padding: '16px',
                }}>
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={{ color: 'rgba(255, 255, 255, 0.87)' }}></i>
                </div>
            );
        else
            content = (
                this.state.data.map((item, index) => {
                    let avaLink = item.image[2]['#text'];
                    if (avaLink === "")
                        avaLink = '../res/unknown.png';

                    return <SearchResultItem avatar={avaLink} artist={item.name} mbid={item.mbid} key={index}/>
                })
            )

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
                    {content}
                </div>
                <div className="word-cloud" id="word-cloud-content">
                </div>
            </div>
        );
    }

};

Search.propTypes = {
};

Search.defaultProps = {
};