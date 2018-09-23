import React, { Component, Fragment } from 'react';
import LaunchButton from './LaunchButton';

import './app.scss';

const tglBtnStyle = {
  height: 30,
  width: 30,
  bottom: 10,
  right: 0,
  background: '#333',
  border: 'none',
  position: 'absolute',
};

function ToggleBtn(props) {
  return (
    <button style={tglBtnStyle} onClick={props.onClick}> </button>
  )
}

class Devtools extends Component {

  fields = [
    { label: 'Label', name: 'label', value: 'Hermedex Sharps Disposer' },
    { label: 'Pid1', name: 'pid1', value: 10 * 60 },
    { label: 'Pid2', name: 'pid2', value: 10 * 60 },
    { label: 'cd1', name: 'cooldown1', value: 1 * 60 },
    { label: 'cd2', name: 'cooldown2', value: 10 * 60 },
  ]

  runUpdate() {
    fetch('/api/forceupdate')
    //   .then(res => res.json())
    //   .then(user => this.setState({ username: user.username }));
  }

  renderField({ label, name, value }, key) {
    return (
      <div key={key}>
        <label>{label} <input name={name} value={value} /></label>

      </div>
    )
  }
  render() {
    return (
      <div style={{ background: '#eee', flex: '1 1 auto'  }}>
        <h2>Settings</h2>
        {
          this.fields.map(this.renderField)
        }
        <hr/>
        <div>
          <button onClick={this.runUpdate}>Update!</button>
        </div>
      </div>
    )
  }
}

export default class App extends Component {

  containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    flexWrap: 'nowrap'
  }

  constructor(props) {
    super(props);
    this.state = {
      isDevtoolsOpen: false,
    };

    this.toggleDevtools = this.toggleDevtools.bind(this);
  }

  componentDidMount() {
    // fetch('/api/getUsername')
    //   .then(res => res.json())
    //   .then(user => this.setState({ username: user.username }));
  }

  toggleDevtools() {
    this.setState({ isDevtoolsOpen: !this.state.isDevtoolsOpen })
  }

  render() {
    const { isDevtoolsOpen } = this.state;
    return (
      <div style={this.containerStyle}>
        <div style={{ position: 'relative', width: isDevtoolsOpen ? '50%' : '100%' }}>
          <h1>Hermedex Sharps Disposer</h1>
          <LaunchButton />
          <ToggleBtn onClick={this.toggleDevtools} />
        </div>
        { isDevtoolsOpen &&
           <Devtools />
        }
      </div>
    );
  }
}
