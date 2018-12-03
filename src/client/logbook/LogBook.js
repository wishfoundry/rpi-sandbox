import React, { Component, Fragment } from 'react';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Typography from '@material-ui/core/Typography'
import ListSubheader from '@material-ui/core/ListSubheader'
import IconButton from '@material-ui/core/IconButton';
import TimerIcon from '@material-ui/icons/Timer';
import OpenIcon from '@material-ui/icons/OpenInNew';
import Grid from '@material-ui/core/Grid';



const renderItems = (items) =>
    items.map((item, i) => (
        <ListItem>
            <ListItemAvatar>
                <span>#{i}</span>
            </ListItemAvatar>
            <ListItemAvatar >
                <TimerIcon />
            </ListItemAvatar>
            <ListItemText primary={item.user} secondary={item.created} />
            <Typography color="secondary" style={{ flex: '1 1 auto' }}>Sharps Cycle</Typography>
            <ListItemSecondaryAction>
                <IconButton aria-label="Open">
                    <OpenIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    ))

const dummyItems = Array.from({length: 20}, (x,i) => i)
        .reduce((sum, i) => {
            sum.items.push({
                user: 'Suzie Q.',
                created: new Date(sum.date - (i * (45 * 60 * 1000))).toGMTString()
            })
            return sum
        }, { items: [], date: Date.now() })
        .items;

export default function LogBook() {
    return (
        <Grid item style={{ overflowY: 'auto' }}>
            <List>
                { renderItems(dummyItems) }
            </List>
        </Grid>
    );
}