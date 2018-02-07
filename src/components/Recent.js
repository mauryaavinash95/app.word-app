import React from 'react';
import { fetchRecent } from '../functions/fetchRecent';
import WordList from './WordList';

export default class Recent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recentResult: [],
            loading: true,
        }
        this.fetchRecent = fetchRecent;
    }

    componentWillMount() {
        this.fetchRecent()
            .then((results) => {
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