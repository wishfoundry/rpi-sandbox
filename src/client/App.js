import React, { Component, Fragment } from 'react';
import LaunchButton from './LaunchButton';
import LogBook from './logbook/LogBook';
import Devtool from './config/DevTool';
import { styled } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import SettingsIcon from '@material-ui/icons/Settings'
import WifiIcon from '@material-ui/icons/Wifi';
import LogbookIcon from '@material-ui/icons/LibraryBooksTwoTone';
import RunIcon from '@material-ui/icons/Timer';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography'
import WifiManager from './wifi/WifiManager';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  dangerouslyUseGlobalCSS: true,
});


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

const TABS = {
  RUN: 'Main',
  CONFIG: 'Settings',
  LOGBOOK: 'Logbook',
  WIFI: 'WiFi',
}

const RunMain = ({ settings }) => (
  <>
    <Grid item style={{ flexGrow: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LaunchButton />
    </Grid>
    <Typography variant="h2" style={{ textAlign: 'center' }}>{settings.label}</Typography>
  </>
)

class App extends Component {

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
      },
      tab: TABS.RUN
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

  switchTab = (e, tab) => {
    this.setState({ tab });
  }

  render() {
    const { isDevtoolsOpen, settings, tab } = this.state;
    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <Grid container direction="row" style={{height: '100%'}}>
          <Grid container direction="column" wrap="nowrap">
          <AppBar position="static"  color="default">
            <Tabs value={tab} fullWidth onChange={this.switchTab}>
              <Tab value={TABS.RUN} label={TABS.RUN} icon={<RunIcon/>} />
              <Tab value={TABS.LOGBOOK} label={TABS.LOGBOOK} icon={<LogbookIcon/>} />
              <Tab value={TABS.WIFI} label={TABS.WIFI} icon={<WifiIcon/>} />
              <Tab value={TABS.CONFIG} label={TABS.CONFIG} icon={<SettingsIcon />}/>
            </Tabs>
            </AppBar>
            { tab === TABS.RUN && <RunMain settings={settings} /> }
            { tab === TABS.CONFIG && <Devtool settings={settings} /> }
            { tab === TABS.LOGBOOK && <LogBook /> }
            { tab === TABS.WIFI && <WifiManager /> }
          </Grid>
          
        </Grid>
      </JssProvider>
    );
  }
}

export default App