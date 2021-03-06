import React, { Component, Fragment } from 'react';
import Button, { STATE } from './ProgressButton';

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

export default class Updater extends Component {

    static defaultProps = {
        endpoint: '/api/pull-latest'
    }

    state = {
        status: NOTHING,
        response: ''
    }

    runUpdate = () => {
        this.setState({
            status: LOADING
        });

        const exec = this.props.onClick || (() => fetch(this.props.endpoint));

        exec()
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
                    {this.props.children}
                </Button>
                <pre>{response}</pre>
            </Fragment>
        );
    }
}