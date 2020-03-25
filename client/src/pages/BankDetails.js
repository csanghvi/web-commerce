import React, { Component } from 'react'
import CaptureBankInfo from "../components/CaptureBankInfo"
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut, checkLoginStatus } from "../actions";
import apiClient from '../api/apiClient'

import Header from "../components/Header"

class BankDetails extends Component {
  constructor(props) {
    super(props)
    
  }

  
    render() {
      console.log("In Bank Details of current user is %o", this.props.currentUserObj)
        return (
            <div>
                 <div className="header_primary">
                    <Header  hideSearch={true}/>
                 </div>
                <div className = "signin_container">
                    {this.props.isSignedIn ?
                    <React.Fragment>
                        <CaptureBankInfo />
                    </React.Fragment>
                    : 
                    <React.Fragment>
                       <Redirect to="/login" />;
                    </React.Fragment>}
                </div>
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
    { signIn, signOut, checkLoginStatus }
  )(BankDetails);
