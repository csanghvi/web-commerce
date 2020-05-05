import React, { Component } from 'react';
import { Redirect, Link, withRouter } from "react-router-dom";
import { Icon, Input , Form} from 'semantic-ui-react'
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";
import logo from '../img/infinity.jpeg'

import Logout from "./Logout";




class Header extends Component{
  constructor(props) {
    super(props)
    }

  handleSearchInput = (e) => {
    console.log("Search value is %o", e.target.value)
  }
  search = (e) => {
    e.preventDefault()
    console.log("start searching")
    this.props.history.push('/listings')

  }

  render(){
    return(
        <div>
            <ul className="navigation">
                <span className='navigation_title'>
                    <li><Link to = '/'><img src={logo} alt="Logo" className="logo" /></Link></li>
                </span>
                {!this.props.hideSearch &&
                <span className='navigation_title' style={{marginTop:"16px"}}>
                    <li><Form.Input icon={<Icon name='search' onClick={this.search} inverted circular link />} 
                                    placeholder='Search events' 
                                    onChange={this.handleSearchInput}/></li>
                </span>
                }
                {!this.props.isSignedIn ?
                <React.Fragment>
                  <li className='navigation_list'><Link to='/register'>Sign up</Link></li>
                  <li className='navigation_list'><Link to = '/login'>Sign in</Link></li>
                </React.Fragment>
                :  
                <React.Fragment>
                  {//<li className='navigation_list'><Link to='/plans'> <Icon name='payment' /></Link></li>
                  }
                  <li className='navigation_list'><Link to='/listings/new'> <Icon name='plus' /></Link></li>
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

export default withRouter (connect(
  mapStateToProps,
  { signIn, signOut }
)(Header));
