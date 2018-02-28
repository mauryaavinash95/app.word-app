import React from 'react';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Autosuggest from 'react-autosuggest';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import Header from './Header';
import WordCard from './WordCard';
import SearchIcon from 'material-ui/svg-icons/action/search';
import { fetchWord } from '../functions/fetchWord';
import { fetchSuggestions } from '../functions/fetchSuggestions';
import '../styles/home.css';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            searchResult: null,
            searchDisabled: false,
            searchButtonText: "Search",
            error: "",
            dataSource: []
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
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (this.state.searchText) {
            if (this.state.searchDisabled === false) {
                this.setState({
                    searchDisabled: true,
                    searchButtonText: "Searching..."
                })
                this.fetchWord(this.state.searchText.toLowerCase(), 1)
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

    handleUpdateInput = (value) => {
        this.setState({
            searchText: value
        })
        if (value.length >= 3) {
            console.log("More than 3 chars");
            fetchSuggestions(value)
                .then((response) => {
                    console.log("Response is: ", response);
                    this.setState({
                        dataSource: response,
                    });
                })
                .catch((err) => {
                    console.log("Error is: ", err);
                    this.setState({
                        dataSource: [],
                    });
                })
        }
    };



    render() {
        return (
            <div className="homeContainer">
                <form onSubmit={this.searchSubmit.bind(this)}>
                    <div style={{ position: 'relative', width: '100%', display: 'inline-block' }}>
                        <div onClick={() => { this.searchSubmit(); }} className="searchButton">
                            <SearchIcon />
                        </div>
                        <div>
                            <div style={{ width: "94%" }}>
                                <AutoComplete
                                    hintText="Enter search term"
                                    dataSource={this.state.dataSource}
                                    onUpdateInput={this.handleUpdateInput}
                                    fullWidth={true}
                                    value={this.state.searchText}
                                    onNewRequest={this.searchSubmit.bind(this)}
                                />
                            </div>
                            {/* <TextField
                                hintText="Enter search term"
                                value={this.state.searchText}
                                onChange={this.changeSearchText.bind(this)}
                                style={{ width: "94%" }}
                                autoFocus
                                disabled={this.state.searchDisabled}
                            /> */}
                        </div>
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
                                <div style={{ textAlign: "center" }}>
                                    <RefreshIndicator
                                        size={40}
                                        left={10}
                                        top={0}
                                        status="loading"
                                        style={{ display: 'inline-block', position: 'relative' }}
                                    />
                                </div>
                                :
                                undefined
                    }
                </div>
            </div>
        )
    }
}