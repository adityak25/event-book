import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className='main-content'>
            <Switch>
              <Redirect from='/' to='/auth' exact />
              <Route path='/auth' component={AuthPage} />
              <Route path='/events' component={EventsPage} />
              <Route path='/bookings' component={BookingsPage} />
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    </div>
  );
}

export default App;
