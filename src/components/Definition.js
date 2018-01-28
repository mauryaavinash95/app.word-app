import React from 'react';
import '../styles/definition.css';

export default class Definition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sense: this.props.sense,
        }
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
            this.setState({
                sense: newProps.sense
            })
        }
    }

    renderDefinition() {
        return (
            <span>
                {this.state.sense.definitions[0]}
            </span>
        )
    }

    renderExamples(examples) {
        if (examples) {
            return examples.map((example, index) => {
                return (
                    <li style={{ listStyleType: "none" }} key={"example_" + example.text + index}>
                        <i>"{example.text}"</i>
                    </li>
                )
            });
        } else {
            return undefined;
        }
    }

    renderSubsenses() {
        if (this.state.sense.subsenses) {
            return this.state.sense.subsenses.map((subSense, index) => {
                if (subSense.definitions) {
                    return (
                        <li key={"subSense_" + index} style={{ listStyleType: "disc" }}>
                            {subSense.definitions[0]}
                            <ul>
                                {this.renderExamples(subSense.examples)}
                            </ul>
                        </li>
                    )
                }
            })
        }
    }

    renderMainSense() {
        return (
            <div>
                {this.renderDefinition()}
                <ul>
                    <ul>
                        {this.renderExamples(this.state.sense.examples)}
                    </ul>
                </ul>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderMainSense()}
                <ul>
                    {this.renderSubsenses()}
                </ul>
            </div>
        );
    }
}