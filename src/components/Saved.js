import React from 'react';
import { backendUrl } from '../config/config';
import WordList from './WordList';
import { getCredentials } from '../functions/credentials';


export default class Saved extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            savedResult: []
        }
        // console.log("In saved.js: ", this.props.userId);
    }

    componentWillMount() {
        this.fetchFavorites();
    }

    fetchFavorites() {
        getCredentials()
            .then(credentials => {
                // console.log("GetCredentials: ", credentials);
                let route = backendUrl + "favorites";
                let body = credentials
                let options = {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                }
                fetch(route, options)
                    .then((result) => result.json())
                    .then((responseJson) => {
                        // console.log("Got response as : ", responseJson);
                        if (responseJson.code === 200) {
                            this.setState({
                                savedResult: responseJson.message
                            });
                        } else {
                            this.setState({
                                savedResult: []
                            })
                        }
                    })
                    .catch((err) => {
                        console.log("Error: ", err);
                    })
            })

    }

    render() {
        return (
            <div>
                <WordList result={this.state.savedResult} key="wordListKeySaved" />
            </div>
        )
    }
}