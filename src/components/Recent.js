import React from 'react';
import { fetchRecent, fetchCacheRecent } from '../functions/fetchRecent';
import WordList from './WordList';


export default class Recent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recentResult: [],
            loading: true,
        }
        this.fetchRecent = fetchRecent;
        this.fetchCacheRecent = fetchCacheRecent;
    }

    componentWillMount() {
        let networkRes = false;
        this.fetchCacheRecent()
            .then((results) => {
                console.log("Showing from cache");
                if (networkRes === false && results && results.message && results.message.length > 0) {
                    console.log("Showed from cache");
                    this.setState({
                        recentResult: results.message,
                        loading: false,
                    })
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
            })
        this.fetchRecent()
            .then((results) => {
                networkRes = true;
                console.log("Showing from network now");
                this.setState({
                    recentResult: results.message,
                    loading: false,
                })
            })
            .catch((err) => {
                console.log("Error: ", err);
            })
    }

    render() {
        return (
            <div>
                <WordList loading={this.state.loading} result={this.state.recentResult} key="wordListKey" />
            </div>
        )
    }
}