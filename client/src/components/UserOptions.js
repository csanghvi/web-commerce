import React, { Component } from "react";
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { signIn, signOut } from "../actions";
import { Redirect, Link, withRouter } from "react-router-dom";

//this.props.onSignOutClick


class UserOptions extends Component {

  onSignOutClick = () => {
    this.props.signOut();
  };

  redirectToProfile = () => {
    console.log('Redirecting')
    this.props.history.push(`/profile`);
  };

  redirectToSettings = () => {
    console.log('Redirecting')
    this.props.history.push(`/settings`);
  };

  render() {
    return (

        <Dropdown className='link item icon user-options' trigger={this.props.currentUserObj.email}>
          <Dropdown.Menu className="user-options-dd">
            <Dropdown.Item className="user-options-dd" icon='user' text='Dashboard' onClick={this.redirectToProfile}/>
            <Dropdown.Item className="user-options-dd" icon='settings' text='Settings' onClick={this.redirectToSettings}/>
            <Dropdown.Item className="user-options-dd" icon='sign out' text='Sign Out' onClick={this.onSignOutClick}/>
          </Dropdown.Menu>
        </Dropdown>


    );
  }
}

const mapStateToProps = state => {
  return {
    currentUserObj: state.auth.userObj,
    isSignedIn: state.auth.isSignedIn
  };
};


export default withRouter (connect(
  mapStateToProps,
  { signIn, signOut }
)(UserOptions));
