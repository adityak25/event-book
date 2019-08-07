import React, { Component } from 'react';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import history from './history';
import './App.css';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';

import AuthContext from './context/auth-context';
import MainNavigation from './components/Navigation/MainNavigation';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({
      token: token,
      userId: userId
    });
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null
    });
  };
  render() {
    return (
      <div className='App'>
        <Router history={history}>
          <React.Fragment>
            <AuthContext.Provider
              value={{
                token: this.state.token,
                userId: this.state.userId,
                login: this.login,
                logout: this.logout
              }}>
              <div className='main-root'>
                <MainNavigation />
                <main className='main-content'>
                  <Switch>
                    {this.state.token && (
                      <Redirect from='/' to='/events' exact />
                    )}
                    {this.state.token && (
                      <Redirect from='/auth' to='/events' exact />
                    )}
                    {!this.state.token && (
                      <Route path='/auth' component={AuthPage} />
                    )}
                    <Route path='/events' component={EventsPage} />
                    {this.state.token && (
                      <Route path='/bookings' component={BookingsPage} />
                    )}
                    {!this.state.token && <Redirect to='/auth' exact />}
                  </Switch>
                </main>
              </div>
            </AuthContext.Provider>
          </React.Fragment>
        </Router>
      </div>
    );
  }
}

export default App;
