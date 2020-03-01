import React, { Component } from 'react'
import { Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import List from './pages/List';
import Details from './pages/Details'
import history from "./History";
import Profile from "./pages/Profile";
import NewListing from "./pages/NewListing"


export default class App extends Component {
  render() {
    return (
      <div>
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/register" exact component={Register} />
                <Route path="/login" exact component={Login} />
                <Route path="/listings" exact component={List} />
                <Route path="/listings/:id" component={Details} />
                <Route path="/profile" component={Profile} />
                <Route path="/new" component={NewListing} />
              </Switch>
          </Router>       
      </div>
    )
  }
}
