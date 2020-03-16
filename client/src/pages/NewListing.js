import React, { Component } from 'react'
import BuildListing from "../components/BuildListing"
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";
import SignUpAsASellerModal from "../components/SignUpAsASellerModal"

import Header from "../components/Header"

class NewListing extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }
  
    render() {
      console.log("Value of current user is %o", this.props.currentUserObj)
      let isConnectedAccount = Object.prototype.hasOwnProperty.call(this.props.currentUserObj, "stripeAccountId") ? true : false
        return (
            <div>
                 <div className="header_other-pages">
                    <Header/>
                 </div>
                <div className = "ui container">
                    {this.props.isSignedIn ?
                      isConnectedAccount ?
                    <React.Fragment>
                        <BuildListing />
                    </React.Fragment>
                    : 
                    <React.Fragment>
                      <SignUpAsASellerModal />
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
    { signIn, signOut }
  )(NewListing);
