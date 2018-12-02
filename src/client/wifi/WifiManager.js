import React, { Component, Fragment } from 'react';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import IconButton from '@material-ui/core/IconButton';
import TimerIcon from '@material-ui/icons/Timer';
import OpenIcon from '@material-ui/icons/OpenInNew';
import Wifi0 from '@material-ui/icons/SignalWifi0Bar';
import Wifi1 from '@material-ui/icons/SignalWifi1Bar';
import Wifi2 from '@material-ui/icons/SignalWifi2Bar';
import Wifi3 from '@material-ui/icons/SignalWifi3Bar';
import Wifi4 from '@material-ui/icons/SignalWifi4Bar';

const networks = [
    { label: 'Whack-a-mole', name: 'wam', strength: 5, connected: false },
    { label: 'Galaga', name: 'galaga', strength: 7, connected: false },
    { label: 'Tetris', name: 'tetris', strength: 3, connected: false },
    { label: 'Metro', name: 'metro', strength: 9, connected: true },
];

const WifiIcon = ({ strength }) => {
    if (strength > 7) return <Wifi4/>
    if (strength > 5) return <Wifi3/>
    if (strength > 3) return <Wifi2/>
    if (strength >= 1) return <Wifi1/>
    return <Wifi0/>
}


export default function WifiManager() {
    return (
        <List>
            { networks.map(network => (
                <ListItem button selected={network.connected}>
                    <ListItemIcon>
                        <WifiIcon strength={network.strength} />
                    </ListItemIcon>
                    <ListItemText primary={network.label} />
                </ListItem>
            )) }
        </List>
    )
}