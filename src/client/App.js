import React, { Component } from 'react';
import LaunchButton from './LaunchButton';

import './app.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { username: null };
  }

  componentDidMount() {
    // fetch('/api/getUsername')
    //   .then(res => res.json())
    //   .then(user => this.setState({ username: user.username }));
  }

  render() {
    return (
      <div>
        <h1>hermedex</h1>
        <LaunchButton />
      </div>
    );
  }
}
