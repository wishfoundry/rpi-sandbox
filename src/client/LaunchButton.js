import React, { Component } from 'react';
import Button, { STATE } from 'react-progress-button';
import './progress-button.scss';

const { LOADING, NOTHING, DISABLED, SUCCESS, ERROR } = STATE

export default class LaunchButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: NOTHING
        };
    }

    onStart = () => {
        this.setState({
            status: LOADING
        });

        setTimeout(() => {
            this.setState({
                status: SUCCESS
            });
        }, 3000)
    }

    render() {
        const { status } = this.state
        return (
            <Button onClick={this.onStart} state={status}>
                Ignite!
            </Button>
            
        )
    }
}