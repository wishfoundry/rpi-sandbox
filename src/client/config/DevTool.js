import React, { Component, Fragment } from 'react';
import Updater from '../AppUpdater';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import { FormControl } from '@material-ui/core';

function getInputType(value) {
    if (typeof value === 'number')
    return 'number';
    return 'text'
  }

export default class Devtools extends Component {

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
  
    updateField(name, value) {
      this.setState({
        ...this.state,
        fields: {
          ...this.state.fields,
          [name]: value,
        }
      })
    }
  
    text = (e) => {
      this.updateField(e.target.name, e.target.value)
    }
    number = (e) => {
      this.updateField(e.target.name, parseInt(e.target.value || 0))
    }
  
    renderField({ name, value }) {
      const type = getInputType(value);
      return (
        <div key={name}>
          <FormControl fullWidth>
            <InputLabel>{name} : </InputLabel>
            <Input
              name={name}
              value={value}
              type={type}
              style={{ flex: '1 1 auto' }}
              onChange={this[type]} />
          </FormControl>
  
        </div>
      )
    }
    render() {
      return (
        <Grid item style={{ overflowY: 'auto'  }}>

          <h2>Settings</h2>
          {
            Object.keys(this.state.fields).map((name) =>
              this.renderField({ name: name, value: this.state.fields[name] }))
          }
          
          <hr/>
          <div>
            <Updater onClick={this.saveFields}>Save Settings</Updater>
            <Updater endpoint="/api/pull-latest">Pull latest Update</Updater>
            <Updater endpoint="/api/rebuild" >Rebuild</Updater>
            <Updater endpoint="/api/kill-chrome" >Kill</Updater>
          </div>
          <pre>{this.state.forceUpdate}</pre>
        </Grid>
      )
    }
  }