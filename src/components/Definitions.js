import React from 'react';
import Definition from './Definition';

export default class Definitions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: this.props.result,
        }
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
            this.setState({
                result: newProps.result
            })
        }
    }

    render() {
        return this.state.result.lexicalEntries[0].entries[0].senses.map(function (sense, index) {
            return (
                <li key={"sense_" + index}>
                    <Definition sense={sense} />
                </li>
            )
        }, this);
    }
}