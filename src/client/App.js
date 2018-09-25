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

  constructor(props) {
    super(props);
    this.state = {
      forceUpdate: '',
      fields: props.settings,
    };

    this.runUpdate = this.runUpdate.bind(this);
    this.saveFields = this.saveFields.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  runUpdate() {
    fetch('/api/force-update')
      .then((res) => {
        this.setState({
          forceUpdate: JSON.stringify(res.json())
        })
      })
    //   .then(res => res.json())
    //   .then(user => this.setState({ username: user.username }));
  }

  saveFields() {
    fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.fields)
    }).then(() => {
      location.reload();
    })
  }

  updateField(e) {
    
    const name = e.target.name;
    let value = parseInt(e.target.value);
    if (isNaN(value))
      value = e.target.value;

    this.setState({
      ...this.state,
      fields: {
        ...this.state.fields,
        [name]: value,
      }
    })
  }

  renderField({ name, value }) {
    return (
      <div key={name}>
        <label>
          {name}
          <input
            name={name}
            value={value}
            onChange={this.updateField} />
        </label>

      </div>
    )
  }
  render() {
    return (
      <div style={{ background: '#eee', flex: '1 1 auto'  }}>
        <h2>Settings</h2>
        {
          Object.keys(this.state.fields).map((name) =>
            this.renderField({ name: name, value: this.state.fields[name] }))
        }
        <div>
          <button onClick={this.saveFields}>Save</button>
        </div>
        <hr/>
        <div>
          <button onClick={this.runUpdate}>Pull Latest Backup!</button>
        </div>
        <pre>{this.state.forceUpdate}</pre>
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
      settings: {
        label: 'Foo' //Hermedex Sharps Disposer
      }
    };

    this.toggleDevtools = this.toggleDevtools.bind(this);
  }

  componentDidMount() {
    fetch('/api/settings')
      .then(res => res.json())
      .then(settings => {
          this.setState({
          settings: settings
        })
      }
      );
  }

  toggleDevtools() {
    this.setState({ isDevtoolsOpen: !this.state.isDevtoolsOpen })
  }

  render() {
    const { isDevtoolsOpen, settings } = this.state;
    return (
      <div style={this.containerStyle}>
        <div style={{ position: 'relative', width: isDevtoolsOpen ? '50%' : '100%' }}>
          <h1>{settings.label}</h1>
          <LaunchButton />
          <ToggleBtn onClick={this.toggleDevtools} />
        </div>
        { isDevtoolsOpen &&
           <Devtools settings={settings} />
        }
      </div>
    );
  }
}
