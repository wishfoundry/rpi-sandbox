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



const renderItems = (items) =>
    items.map(item => (
        <ListItem>
            <ListItemAvatar >
                <TimerIcon />
            </ListItemAvatar>
            <ListItemText primary="Suzie Q." secondary="Jan 1" />
            <ListItemSecondaryAction>
                <IconButton aria-label="Open">
                    <OpenIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    ))

export default function LogBook() {
    return (
        <List>
            { renderItems([{}, {}, {}, {}]) }
        </List>
    );
}