import React, { Component, Fragment } from 'react';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'

import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import OpenIcon from '@material-ui/icons/OpenInNew';
import Grid from '@material-ui/core/Grid';



const renderItems = (items) =>
    items.map(person => (
        <ListItem>
            <ListItemAvatar >
                <PersonIcon />
            </ListItemAvatar>
            <ListItemText primary={person.name} secondary={person.type} />
            <ListItemSecondaryAction>
                <IconButton aria-label="Open">
                    <OpenIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    ))

const ROLES = {
    ADMIN: 'admin',
    SALES: 'sales',
    DEFAULT: 'moron'
};

const dummyItems = [
    { name: 'Suzie Q.', type: ROLES.DEFAULT }, 
    { name: 'Arnold Z.', type: ROLES.DEFAULT }, 
    { name: 'Charlie C.', type: ROLES.ADMIN }, 
];

export default function Users() {
    return (
        <Grid item style={{ overflowY: 'auto' }}>
            <List>
                { renderItems(dummyItems) }
            </List>
        </Grid>
    );
}