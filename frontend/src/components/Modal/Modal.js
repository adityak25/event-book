import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import './Modal.css';
import isSmallScreen from '../../screenSize';

class Modal extends Component {
  constructor(props) {
    super(props);
    if (props.modalInfo.type === 'newEventForm') {
      this.state = {
        title: '',
        price: '',
        date: new Date(),
        description: ''
      };
    }
  }

  showCreateEventForm = () => {
    return (
      <form>
        <TextField
          margin='normal'
          variant='outlined'
          required
          fullWidth
          label='Event Title'
          name='eventTitle'
          autoFocus
          value={this.state.title}
          onChange={event =>
            this.handleFormValueChange('title', event.target.value)
          }
        />
        <div className={!isSmallScreen() ? 'modal-items__row' : null}>
          <TextField
            margin='normal'
            variant='outlined'
            style={{ paddingRight: '5px' }}
            required
            fullWidth
            name='eventPrice'
            label='Price'
            type='number'
            value={this.state.price}
            onChange={event =>
              this.handleFormValueChange('price', event.target.value)
            }
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin='normal'
              variant='dialog'
              disableToolbar
              format='MM/dd/yyyy'
              required
              label='Date picker inline'
              value={this.state.date}
              onChange={event => this.handleFormValueChange('date', event)}
            />
          </MuiPickersUtilsProvider>
        </div>
        <TextField
          margin='normal'
          variant='outlined'
          fullWidth
          name='eventDescription'
          label='Description'
          type='text'
          multiline={true}
          rows='4'
          placeholder='Tell us about the event...'
          value={this.state.description}
          onChange={event =>
            this.handleFormValueChange('description', event.target.value)
          }
        />
      </form>
    );
  };

  handleFormValueChange = (target, changedValue) => {
    this.setState({
      [target]: changedValue
    });
  };

  submitCreateEvent = () => {
    const newEvent = {
      ...this.state
    };
    this.props.handleSubmit(newEvent);
    this.props.handleClose();
  };

  render() {
    return (
      <Dialog
        fullScreen={isSmallScreen()}
        open={this.props.open}
        disableBackdropClick
        onClose={this.props.handleClose}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='responsive-dialog-title'>
          {this.props.modalInfo.title}
        </DialogTitle>
        <DialogContent>{this.showCreateEventForm()}</DialogContent>
        <DialogActions>
          <Button
            onClick={this.props.handleClose}
            color='primary'
            variant='contained'
          >
            Cancel
          </Button>
          <Button
            onClick={this.submitCreateEvent}
            color='primary'
            variant='contained'
            autoFocus
            disabled={
              this.state.title === '' ||
              this.state.description === '' ||
              this.state.price === ''
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default Modal;
