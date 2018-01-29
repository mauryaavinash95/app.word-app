import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import Header from './Header';
import WordCard from './WordCard';
import SearchIcon from 'material-ui/svg-icons/action/search';
import { fetchWord } from '../functions/fetchWord';
import '../styles/home.css';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            searchResult: null,
            searchDisabled: false,
            searchButtonText: "Search",
            error: ""
        }
        this.fetchWord = fetchWord;
    }

    changeSearchText(e) {
        this.setState({
            searchText: e.target.value,
        })
    }

    showError(error) {
        this.setState({
            error
        }, () => {
            setTimeout(() => {
                this.setState({
                    error: null,
                })
            }, 10000);
        })
    }

    searchSubmit(e) {
        e.preventDefault();
        if (this.state.searchText) {
            if (this.state.searchDisabled === false) {
                this.setState({
                    searchDisabled: true,
                    searchButtonText: "Searching..."
                })
                this.fetchWord(this.state.searchText, 1)
                    .then((response) => {
                        this.setState({
                            searchResult: response,
                            searchDisabled: false,
                            searchButtonText: "Search"
                        });
                    })
                    .catch((err) => {
                        console.log("Got error in Home.js: ", err);
                        this.setState({
                            error: "Please check your connection",
                            searchDisabled: false,
                            searchButtonText: "Search"
                        })
                    })
            }
        } else {
            this.showError("Please enter keyword to search");
        }
    }

    render() {
        return (
            <div className="homeContainer">
                <form onSubmit={this.searchSubmit.bind(this)}>
                    <div style={{ position: 'relative', width: '100%', display: 'inline-block' }}>
                        <div onClick={this.searchSubmit.bind(this)} style={{ position: 'absolute', right: 0, top: 12, width: 20, height: 20 }}>
                            <SearchIcon />
                        </div>
                        <TextField
                            hintText="Enter search term"
                            value={this.state.searchText}
                            onChange={this.changeSearchText.bind(this)}
                            fullWidth={true}
                            autoFocus
                        />
                    </div>
                    <div style={{ color: "red" }}>
                        {this.state.error}
                    </div>
                </form>
                <div className="wordCard">
                    {
                        this.state.searchResult ?
                            <WordCard result={this.state.searchResult} />
                            :
                            this.state.searchDisabled ?
                                <RefreshIndicator
                                    size={40}
                                    left={10}
                                    top={0}
                                    status="loading"
                                    style={{ display: 'inline-block', position: 'relative' }}
                                />
                                :
                                undefined
                    }
                </div>
            </div>
        )
    }
}