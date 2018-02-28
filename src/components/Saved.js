import React from 'react';
import { backendUrl } from '../config/config';
import WordList from './WordList';
import { getCredentials } from '../functions/credentials';
import { fetchFavorites, fetchCacheFavorites } from '../functions/fetchFavourites';


export default class Saved extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            savedResult: [],
            loading: true
        }
        this.fetchFavorites = fetchFavorites;
        this.fetchCacheFavorites = fetchCacheFavorites;
    }

    componentWillMount() {
        let networkRes = false
        this.fetchCacheFavorites()
            .then((result) => {
                // console.log("Showing favorites from cache now");
                if (networkRes === false) {
                    // console.log("Showed favorites from cache ");
                    this.setState({
                        savedResult: result.message,
                        loading: false
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    savedResult: [],
                    loading: false
                })
            })

        this.fetchFavorites()
            .then((result) => {
                this.setState({
                    savedResult: result.message,
                    loading: false
                });
            })
            .catch((err) => {
                console.log("Error while fetching favourites: ", err);
                this.setState({
                    savedResult: [],
                    loading: false
                })
            })
    }



    render() {
        return (
            <div>
                <WordList loading={this.state.loading} result={this.state.savedResult} key="wordListKeySaved" />
            </div>
        )
    }
}