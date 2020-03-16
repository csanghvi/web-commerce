import React, { Component } from 'react'
import { Router, Switch, Route, BrowserRouter } from 'react-router-dom';
import { connect } from "react-redux";
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import List from './pages/List';
import Details from './pages/Details'
import history from "./History";
import Profile from "./pages/Profile";
import NewListing from "./pages/NewListing"
import UserOptions from "./components/UserOptions"
import Checkout from './pages/Checkout';
import EditListing from './pages/EditListing';
import OauthConnect from './pages/OauthConnect';


class App extends Component {
  renderSidebar() {
    if (this.props.isSignedIn) {
      return (
          <UserOptions />
      );
    }
  }
  render() {
    return (
      <div>
        <BrowserRouter history={history}>
        <div>
            {this.renderSidebar()}
          </div>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/register" exact component={Register} />
                <Route path="/login" exact component={Login} />
                <Route path="/listings/new" exact component={NewListing} />
                <Route path="/listings" exact component={List} />
                <Route path="/listings/edit/:id" exact component={EditListing} />
                <Route path="/listings/:id" component={Details} />
                <Route path="/profile" component={Profile} />
                <Route path="/checkout" component={Checkout} />
                <Route path="/oauth/connect" component={OauthConnect} />
              </Switch>
          </BrowserRouter>       
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUserObj: state.auth.userObj,
    isSignedIn: state.auth.isSignedIn,
    loginError: state.auth.loginError
  };
};
export default connect(
  mapStateToProps,
  {}
)(App);
