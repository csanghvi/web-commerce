import React, { Component } from 'react';
import { Redirect, Link, withRouter } from "react-router-dom";
import { Image, Icon, Input , Menu, Form} from 'semantic-ui-react'
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";
import logo from '../img/stack-raise-dark-blue.png'
import UserOptions from './UserOptions'

import Logout from "./Logout";




class Header extends Component{
  constructor(props) {
    super(props)
    this.state = { activeItem: 'home' }
    }
    

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleSearchInput = (e) => {
    console.log("Search value is %o", e.target.value)
  }
  search = (e) => {
    e.preventDefault()
    console.log("start searching")
    this.props.history.push('/listings')

  }

  render(){
    const { activeItem } = this.state
    return(
        <div style={{marginTop:"40px", marginBottom:"40px", marginLeft:"120px", marginRight:'120px', fontSize:'1.5rem'}}>
        <Menu pointing secondary >
          <Menu.Item
            name='HOW IT WORKS'
            className='menunav'
          />
          <Menu.Item
            name='FAQS'
            className='menunav'
          />
          <Menu.Item
            name='CONTACT'
            className='menunav'
          />
          <Menu.Item>
          <Link to='/'> 
          <Image src={logo} alt="Logo" size="medium"/>
          </Link>
          </Menu.Item>
          <Menu.Menu position='right'>
          {!this.props.isSignedIn ?
          <React.Fragment>
            <Menu.Item className='menunav'><Link to='/register'>Sign up</Link></Menu.Item>
            <Menu.Item className='menunav'><Link to = '/login'>Sign in</Link></Menu.Item>
          </React.Fragment>
          :  
          <React.Fragment>
            <Menu.Item className='menunav'><Link to='/listings/new'> Create Campaign</Link></Menu.Item>
            <Menu.Item className='menunav'><UserOptions /></Menu.Item>

             
     
          </React.Fragment>}
          </Menu.Menu>
        </Menu>

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
