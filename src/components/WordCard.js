import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
// import FlatButton from 'material-ui/FlatButton';
import LexicalEntries from './LexicalEntries';
import Favorites from 'material-ui/svg-icons/action/favorite';
import NonFavorites from 'material-ui/svg-icons/action/favorite-border';
import '../styles/wordCard.css';
import { setSave } from '../functions/setSave';

export default class WordCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: this.props.result,
            isSaved: this.props.result.message.isSaved
        }
    }

    componentWillReceiveProps(newProp) {
        if (JSON.stringify(this.props) !== JSON.stringify(newProp)) {
            this.setState({
                result: newProp.result,
                isSaved: newProp.result.message.isSaved
            })
        }
    }

    setSavedWord(word, isSavedFlag) {
        let { isSaved } = this.state;
        setSave(word, isSaved)
            .then((resolve) => {
                // console.log("Resolved in WordCard.js: ", resolve);
            })
            .catch((err) => {
                // console.log("Error while saving", err);
            })

        isSaved = isSavedFlag === 0 ? 1 : 0;
        this.setState({
            isSaved
        })
    }

    renderCard() {
        if (this.state.result.code === 200) {
            let subtitle = null;
            if (this.state.result.message.lexicalEntries[0].pronunciations) {
                subtitle = "/" + this.state.result.message.lexicalEntries[0].pronunciations[0].phoneticSpelling + "/"
            } else if (this.state.result.message.lexicalEntries[0].entries[0].pronunciations[0].phoneticSpelling) {
                subtitle = "/" + this.state.result.message.lexicalEntries[0].entries[0].pronunciations[0].phoneticSpelling + "/"
            }
            return (
                <Card>
                    <div className="cardHeader">
                        <div>
                            <CardTitle
                                title={this.state.result.message.word}
                                subtitle={subtitle}
                            />
                        </div>
                        <div className="cardFavIcon" onClick={this.setSavedWord.bind(this, this.state.result.message.word, this.state.isSaved)} >
                            {this.state.isSaved === 0 ? <NonFavorites /> : <Favorites />}
                        </div>
                    </div>

                    <CardText>
                        <div>
                            <LexicalEntries results={this.state.result.message} />
                        </div>
                    </CardText>
                </Card>
            )
        } else {
            return (
                <div>
                    {this.state.result.message}
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.state.result !== null ? this.renderCard() : undefined}
            </div>
        )
    }
}