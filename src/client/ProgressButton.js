import React, { Component, Fragment } from 'react';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import TimerIcon from '@material-ui/icons/Timer';
import ErrorIcon from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';

export const STATE = {
    LOADING: 'loading',
    NOTHING: 'default',
    DISABLED: 'disabled',
    SUCCESS: 'success',
    ERROR: 'error'
};

const styles = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 5,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  }

const styleIt = theme => ({
    button: {
        ...styles,
    }
})

const MyButton = (props) => <Button variant="outlined" color="secondary" {...props} /> 

  const Wrapper = ({ children, style }) => (
      <div style={{ position: 'relative', margin: 'auto', ...style }}>{children}</div>
  );

  const ProgressButton = ({ state, onClick, children, style }) => (
      <>
        { state === STATE.LOADING && 
            <Wrapper style={style}>
                <Fab color="secondary"><TimerIcon/></Fab>
                <CircularProgress size={68} style={{ position: 'absolute',top: -6,left: -6, zIndex: 1 }} />
            </Wrapper>
        }
        { state === STATE.SUCCESS && 
            <Wrapper style={style}>
                <Fab color="primary" style={{ backgroundColor: green[500] }}><CheckIcon/></Fab>
            </Wrapper>
        }
        { state === STATE.ERROR &&
            <Wrapper style={style}>
                <Fab color="primary" style={{ backgroundColor: red[500] }}><ErrorIcon/></Fab>
             </Wrapper>
        }
        { state === STATE.NOTHING &&
            <MyButton onClick={onClick} style={style}>{children}</MyButton>
        }
      </>
  );

  export default ProgressButton