import React from 'react';
import Definition from './Definition';

export default class LexicalEntries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: this.props.results,
        }
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
            this.setState({
                results: newProps.results
            })
        }
    }

    renderSenses(lexicalEntry) {
        return lexicalEntry.entries[0].senses.map(function (sense, index) {
            return (
                <li key={"sense_" + index}>
                    <Definition sense={sense} />
                </li>
            )
        }, this);
    }

    renderLexicalEntries() {
        return this.state.results.lexicalEntries.map((lexicalEntry, index) => {
            return (
                <div key={"lexicalEntry_" + index}>
                    <i>{lexicalEntry.lexicalCategory}</i>
                    <ol>
                        {this.renderSenses(lexicalEntry)}
                    </ol>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                {this.renderLexicalEntries()}
            </div>
        );
    }
}