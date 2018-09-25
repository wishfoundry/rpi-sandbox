import React, { Component, Fragment } from 'react';
import Button, { STATE } from 'react-progress-button';

const {
    LOADING,
    NOTHING,
    DISABLED,
    SUCCESS,
    ERROR
  } = STATE;

  
const pauseFor = seconds =>
    new Promise(resolve =>
        setTimeout(() => resolve(), Math.floor(seconds * 1000)));

const btnStyles = {
    backgroundColor: 'blue !important'
}

export default class AppUpdater extends Component {

    state = {
        status: NOTHING,
        response: ''
    }

    runUpdate = () => {
        this.setState({
            status: LOADING
        });

        fetch('/api/pull-latest')
            .then(res => res.json())
            .then((res) => {
                const { message, error } = res;
                console.log(res)

                this.setState({
                    status: message ? SUCCESS : ERROR,
                    response: message || error
                });
                return pauseFor(2)
            })
            .then(() => {
                this.setState({
                    status: NOTHING,
                    response: ''
                });
            })
    }

    render() {
        const { status, response } = this.state;
        return (
            <Fragment>
                <Button onClick={this.runUpdate} state={status} classNamespace={'dev-'}>
                    Pull latest Update!
                </Button>
                <pre>{response}</pre>
            </Fragment>
        );
    }
}