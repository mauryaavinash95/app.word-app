import React from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import WordCard from './WordCard';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import { fetchWord } from '../functions/fetchWord';
import '../styles/wordList.css';

export default class WordList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordList: this.props.result,
            loading: true,
            wordResult: []
        }
        this.fetchWord = fetchWord;
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(newProps) !== JSON.stringify(this.props)) {
            this.setState({
                wordList: newProps.result,
                loading: newProps.loading,
            })
        }
    }

    showMeaning(index, word, userId) {
        let { wordResult } = this.state;
        this.fetchWord(word, 0)
            .then((response) => {
                wordResult[index] = response;
                this.setState({
                    wordResult
                })
            })
    }

    render() {
        if (this.state.wordList.length > 0) {
            return this.state.wordList.map((word, index) => {
                return (
                    <div key={"wordList_" + index} onClick={this.showMeaning.bind(this, index, word.word, word.userId)} className="wordList">
                        <Card>
                            <CardHeader
                                title={word.word}
                                subtitle={moment(word.time).fromNow()}
                                actAsExpander={true}
                                showExpandableButton={true}
                            />
                            <CardText expandable={true}>
                                {/* isSaved={word.isSaved} */}
                                {
                                    this.state.wordResult[index] ?
                                        <WordCard result={this.state.wordResult[index]} />
                                        :
                                        "Loading"
                                }

                            </CardText>
                        </Card>
                    </div>
                )
            })
        }
        else {
            return (
                <div className="noWordsText">
                    <Paper style={{ textAlign: 'center', display: 'inline-block' }} zDepth={1} >
                        {this.state.loading ? "Loading..." : "No Words found :("}
                    </Paper>
                </div>
            )
        }
    }
}