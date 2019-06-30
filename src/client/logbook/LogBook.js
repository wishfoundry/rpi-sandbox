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
import SuccessIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import DoneIcon from '@material-ui/icons/Done';
import DoneIconAll from '@material-ui/icons/DoneAll';
import PersonIcon from '@material-ui/icons/Person';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import AllInclusive from '@material-ui/icons/AssistantPhoto';
import ProcessTypeIcon from '@material-ui/icons/Security';
import AcUnit from '@material-ui/icons/Whatshot';
import RecordedIcon from '@material-ui/icons/CloudUpload';
import green from '@material-ui/core/colors/green';

import dummyItems from './dummyItems'  

const CYCLE_TIME = 2389

const renderItems = (items, open) =>
    items.map((item, i) => (
        <ListItem>
            <ListItemAvatar>
                <span>#{i}</span>
            </ListItemAvatar>
            <ListItemAvatar >
                <TimerIcon />
            </ListItemAvatar>
            
            <ListItemText primary={item.user}  secondary={formatDate(item.created)} />
            <ListItemIcon>
                {item.isSuccess ? <SuccessIcon color="primary" /> : <ErrorIcon color="error" />}
            </ListItemIcon>
            <Typography color={item.isSuccess ? 'primary' : 'error'} style={{ flex: '1 1 auto' }}>
                Sharps Cycle
            </Typography>
            <ListItemSecondaryAction>
                <IconButton aria-label="Open" onClick={() => open(item)}>
                    <OpenIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    ))

const formatDate = (date) => date ? date.toGMTString() : ''

export default class LogBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            log: null
        }
    }

    openLog = (log) => {
        this.setState({
            open: true,
            log,
        })
    }

    render() {
        const { open, log } = this.state;

        return (
            <Grid item style={{ overflowY: 'auto' }}>
                <List>
                    {renderItems(dummyItems, this.openLog)}
                </List>
                <Drawer open={open} anchor="right" onClose={() => this.setState({ open: false })} >
                    <Typography variant="h4" >Details</Typography>
                    { log && <LogDetails log={log} />}
                </Drawer>
            </Grid>
        );
    }
}

function StatusIcon({ isSuccess }) {
    return isSuccess ? <DoneIcon /> : <ErrorIcon color="error" />
}

function LogDetails(props) {
    const { log: { created, user, isSuccess } } = props
    return (
        <Table>
            <TableRow>
                <TableCell><PersonIcon /> User</TableCell>
                <TableCell>{user}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell><CalendarIcon /> Start Time</TableCell>
                <TableCell>{formatDate(created)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell><CalendarIcon /> End Time</TableCell>
                <TableCell>{formatDate(new Date(created.getTime() + (CYCLE_TIME * 1000)))}</TableCell>
            </TableRow>
            <TableRow><TableCell>
                <CalendarIcon /> Total elapsed time</TableCell>
                <TableCell>{CYCLE_TIME} seconds</TableCell>
            </TableRow>
            <TableRow>
                <TableCell><ProcessTypeIcon /> Type</TableCell>
                <TableCell>Sharps Cycle H MODEL #400 </TableCell>
            </TableRow>
            <TableRow>
                <TableCell><AcUnit /> Full Temperature</TableCell>
                <TableCell> <StatusIcon isSuccess={isSuccess} /> </TableCell>
            </TableRow>
            <TableRow>
                <TableCell><TimerIcon /> Full Cycle Time</TableCell>
                <TableCell> <StatusIcon isSuccess={isSuccess} /> </TableCell>
            </TableRow>
            <TableRow>
                <TableCell><TimerIcon /> Power Failure</TableCell>
                <TableCell> <StatusIcon isSuccess={isSuccess} /> </TableCell>
            </TableRow>
            <TableRow>
                <TableCell><RecordedIcon /> Recorded</TableCell>
                <TableCell><DoneIcon /></TableCell>
            </TableRow>
            <TableRow>
                <TableCell><AllInclusive /> All checks completed</TableCell>
                <TableCell> <StatusIcon isSuccess={isSuccess} /> </TableCell>
            </TableRow>
        </Table>
    );
}

