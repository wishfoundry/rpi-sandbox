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



const renderItems = (items, open) =>
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
                <IconButton aria-label="Open" onClick={() => open(item)}>
                    <OpenIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    ))

const dummyItems = Array.from({ length: 20 }, (x, i) => i)
    .reduce((sum, i) => {
        sum.items.push({
            user: 'Suzie Q.',
            created: new Date(sum.date - (i * (45 * 60 * 1000))).toGMTString()
        })
        return sum
    }, { items: [], date: Date.now() })
    .items;

export default class LogBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            log: {}
        }
    }

    openLog = (log) => {
        this.setState({
            open: true,
            log,
        })
    }

    render() {
        const { open, log: { created, user } } = this.state;

        return (
            <Grid item style={{ overflowY: 'auto' }}>
                <List>
                    {renderItems(dummyItems, this.openLog)}
                </List>
                <Drawer open={open} anchor="right" onClose={() => this.setState({ open: false })} >
                    <Typography variant="h4" >Details</Typography>
                    
                    <Table>
                        <TableRow><TableCell><PersonIcon/> User</TableCell><TableCell>{user}</TableCell></TableRow>
                        <TableRow><TableCell><CalendarIcon/> Date</TableCell><TableCell>{created}</TableCell></TableRow>
                        <TableRow><TableCell><ProcessTypeIcon/> Type</TableCell><TableCell>Sharps Cycle</TableCell></TableRow>
                        <TableRow><TableCell><AcUnit/> Full Temperature</TableCell><TableCell><DoneIcon color="secondary" /></TableCell></TableRow>
                        <TableRow><TableCell><TimerIcon/> Full Cycle Time</TableCell><TableCell><DoneIcon color="secondary"/></TableCell></TableRow>
                        <TableRow><TableCell><RecordedIcon/> Recorded</TableCell><TableCell><DoneIcon color="secondary"/></TableCell></TableRow>
                        <TableRow><TableCell><AllInclusive/> 100% success</TableCell><TableCell><DoneIconAll color="secondary"/></TableCell></TableRow>
                    </Table>
                </Drawer>
            </Grid>
        );
    }
}