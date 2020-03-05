import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react'
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

import Logout from "./Logout";



class Header extends Component{


  render(){
    return(
        <div>

            <ul className="navigation">
                <span className='navigation_title'>
                    <li><Link to = '/'>Experience</Link></li>
                </span>
                {!this.props.isSignedIn ?
                <React.Fragment>
                  <li className='navigation_list'><Link to='/register'>Sign up</Link></li>
                  <li className='navigation_list'><Link to = '/login'>Sign in</Link></li>
                </React.Fragment>
                :  
                <React.Fragment>
                  <li className='navigation_list'><Link to='/new'> <Icon name='plus' /></Link></li>
                </React.Fragment>}
            </ul>
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
  { signIn, signOut }
)(Header);
