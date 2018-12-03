import React, { Component, Fragment } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography'

import SettingsIcon from '@material-ui/icons/Settings'
import ConfigIcon from '@material-ui/icons/SettingsApplicationsTwoTone'
import WifiIcon from '@material-ui/icons/Wifi';
import PeopleIcon from '@material-ui/icons/People';
import LogbookIcon from '@material-ui/icons/LibraryBooksTwoTone';
import RunIcon from '@material-ui/icons/Timer';


import ConfigTool from './DevTool';
import WifiManager from '../wifi/WifiManager'
import UserManager from '../users/Users'

const TABS = {
    WIFI: 'Wifi',
    USERS: 'Users',
    PARAMS: 'Parameters'
}

export default class ConfigMain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: TABS.WIFI
        };
    }
    switchTab = (e, tab) => {
        this.setState({ tab });
    }

    render() {
        const { tab } = this.state;
        return (
            <Grid item>
                <Tabs value={tab} onChange={this.switchTab}>
                    <Tab value={TABS.WIFI} label={TABS.WIFI} icon={<WifiIcon />} />
                    <Tab value={TABS.USERS} label={TABS.USERS} icon={<PeopleIcon />} />
                    <Tab value={TABS.PARAMS} label={TABS.PARAMS} icon={<ConfigIcon />} />
                </Tabs>
                {tab === TABS.PARAMS && <ConfigTool settings={this.props.settings} />}
                {tab === TABS.USERS && <UserManager />}
                {tab === TABS.WIFI && <WifiManager />}
            </Grid>
        )
    }

}