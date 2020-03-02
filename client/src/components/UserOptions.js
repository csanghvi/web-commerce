import React, { Component } from "react";
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux';

//this.props.onSignOutClick


class UserOptions extends Component {


  render() {
    return (

      <div className="right floated content">
        <Dropdown className='link item icon user-options' trigger={this.props.currentUserObj.email}>
          <Dropdown.Menu>
            <Dropdown.Item icon='user' text='Dashboard'/>
            <Dropdown.Item icon='settings' text='Settings'/>
            <Dropdown.Item icon='sign out' text='Sign Out' onClick={this.props.onSignOutClick}/>
          </Dropdown.Menu>
        </Dropdown>

      </div>

    );
  }
}

const mapStateToProps = state => {
  return {
    currentUserObj: state.auth.userObj,
    isSignedIn: state.auth.isSignedIn
  };
};
export default connect(
  mapStateToProps,
  { }
)(UserOptions);
