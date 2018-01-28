import React from 'react';
import { fetchRecent } from '../functions/fetchRecent';
import WordList from './WordList';

export default class Recent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recentResult: []
        }
        this.fetchRecent = fetchRecent;
    }

    componentWillMount() {
        this.fetchRecent()
            .then((results) => {
                this.setState({
                    recentResult: results.message
                })
            })
            .catch((err) => {
                console.log("Error: ", err);
            })
    }

    render() {
        return (
            <div>
                <WordList result={this.state.recentResult} key="wordListKey" />
            </div>
        )
    }
}