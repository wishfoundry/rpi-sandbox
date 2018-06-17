import React, { Component, Fragment } from 'react';
import Button, { STATE } from 'react-progress-button';
// import Socket from 'ws';
import Sockette from 'sockette';
import './progress-button.scss';

const {
    LOADING,
    NOTHING,
    DISABLED,
    SUCCESS,
    ERROR
} = STATE;

const messageStyles = {
    color: 'white',
    textAlign: 'center'
};

export default class LaunchButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: NOTHING,
            message: ''
        };
    }

    componentWillMount() {
        //*
        this.ws = new Sockette('ws://localhost:8080', {
            onmessage: (msg) => {
                console.log('message received', msg);
                this.onMessage(JSON.parse(msg.data));
            },
            onopen() {
                console.info('opened ws')
            },
            onclose() {
                console.info('closed ws')
            },
            onerror(e) {
                console.error('ws error');
                console.error(e);
            }
        });
    }

    componentWillUnmount() {
        this.ws.close();
    }

    onMessage({ message, progress, type }) {

        if (type === 'error') {
            return this.setState({
                message,
                status: ERROR,
            });
        }

        if (progress === 100) {
            setTimeout(() => this.setState({ status: SUCCESS, message: '' }), 500);
        }
        this.setState({
            message,
        });
    }

    onStart = () => {
        this.setState({
            status: LOADING
        });

        this.ws.send(JSON.stringify({ command: 'begin' }));
    }

    onCancel = () => {
        this.ws.send(JSON.stringify({ command: 'cancel' }));
    }

    render() {
        const { status, message } = this.state;
        return (
            <Fragment>
                <Button
                    onClick={this.onStart}
                    state={status}
                >
                    Start
                </Button>
                <div style={messageStyles}>
                    <span style={messageStyles}>{message}</span>
                </div>
            </Fragment>
        );
    }
}
