import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import AuthContext from '../context/auth-context';
import './Events.css';
import AddEvent from '../components/AddEvent/AddEvent';
import isSmallScreen from '../screenSize';

const styles = muiBaseTheme => ({
  eventCardList: {
    display: 'flex',
    flexFlow: 'wrap',
    justifyContent: isSmallScreen() ? 'center' : 'baseline'
  },
  eventCard: {
    width: 300,
    margin: '0.5rem',
    transition: '0.3s',
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
    '&:hover': {
      boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)'
    }
  },
  eventCardMedia: {
    paddingTop: '56.25%'
  },
  eventCardContent: {
    textAlign: 'left',
    padding: muiBaseTheme.spacing(3)
  },
  eventCardDescription: {
    display: '-webkit-box',
    '-webkitLineClamp': '1',
    '-webkitBoxOrient': 'vertical',
    overflow: 'hidden'
  },
  eventCardFooter: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'baseline'
  },
  divider: {
    margin: '0.5rem !important'
  }
});

class EventsPage extends Component {
  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      events: [],
      isLoading: false,
      selectedEvent: null
    };
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  createEventConfirmHandler = newEventData => {
    this.setState({ creating: false });
    const title = newEventData.title;
    const price = +newEventData.price;
    const date = newEventData.date.toISOString();
    const description = newEventData.description;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
            createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
              _id
              title
              description
              date
              price
            }
          }
        `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date
      }
    };

    const token = this.context.token;

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            creator: {
              _id: this.context.userId
            }
          });
          return { events: updatedEvents };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  fetchEvents() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        if (this.isActive) {
          this.setState({ events: events, isLoading: false });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    console.log(this.state.selectedEvent);
    const requestBody = {
      query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
             createdAt
             updatedAt
            }
          }
        `,
      variables: {
        id: this.state.selectedEvent._id
      }
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({ selectedEvent: null });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {this.context.token && (
          <React.Fragment>
            <AddEvent
              createEventConfirmHandler={this.createEventConfirmHandler}
            />
            {/* <Divider className={classes.divider} /> */}
          </React.Fragment>
        )}
        <div className={classes.eventCardList}>
          {this.state.events.map(cardData => {
            const eventCard = (
              <Card className={classes.eventCard}>
                <CardMedia
                  className={classes.eventCardMedia}
                  image={
                    'https://image.freepik.com/free-photo/friends-having-fun-falling-confetti_23-2147651884.jpg'
                  }
                />
                <CardContent className={classes.eventCardContent}>
                  <Typography variant={'h6'} gutterBottom>
                    {cardData.title}
                  </Typography>
                  <Typography
                    variant={'caption'}
                    className={classes.eventCardDescription}
                  >
                    {cardData.description}
                  </Typography>
                  <Divider className={classes.divider} light />
                  <div className={classes.eventCardFooter}>
                    <Typography variant={'caption'}>
                      ${cardData.price}
                    </Typography>
                    <Typography variant={'caption'}>
                      {new Date(cardData.date).toDateString()}
                    </Typography>
                    <Button variant='contained'>More</Button>
                  </div>
                </CardContent>
              </Card>
            );
            return eventCard;
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(EventsPage);
