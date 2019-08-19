import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import Modal from './../Modal/Modal';

const styles = muiBaseTheme => ({
  paperContent: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    padding: '3px 0px 6px 0px',
    position: 'sticky',
    top: '3.5rem'
  }
});

class AddEvent extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  modalInfo = {
    type: null,
    title: ''
  };

  handleClickOpen = () => {
    this.modalInfo = {
      type: 'newEventForm',
      title: 'Create Event'
    };
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Paper className={classes.paperContent}>
          <Typography variant='h6' component='h3'>
            Share your own events!
          </Typography>
          <Tooltip title='Add Event' aria-label='add'>
            <Fab size='small' color='primary' onClick={this.handleClickOpen}>
              <AddIcon />
            </Fab>
          </Tooltip>
        </Paper>
        {this.state.open ? (
          <Modal
            open={this.state.open}
            handleClose={this.handleClose}
            handleSubmit={this.props.createEventConfirmHandler}
            modalInfo={this.modalInfo}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(AddEvent);
