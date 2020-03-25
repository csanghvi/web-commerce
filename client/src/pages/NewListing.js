import React, { Component } from 'react'
import BuildListing from "../components/BuildListing"
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut, checkLoginStatus } from "../actions";
import SignUpAsASellerModal from "../components/SignUpAsASellerModal"
import apiClient from '../api/apiClient'

import Header from "../components/Header"

class NewListing extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       isStripeAccount: false
    }
  }

  componentDidMount(){
    this.props.checkLoginStatus()
    .then(() => {
      this.isAccountReady()
    })
    
  }

  isAccountReady = () => {
    if (this.props.isSignedIn){
      let isStripeAccount = Object.prototype.hasOwnProperty.call(this.props.currentUserObj, "stripeAccountId") ? true : false
      if (isStripeAccount){
        apiClient.getStripeAccountStatus(this.props.currentUserObj.stripeAccountId)
        .then(rsp => {
          if (rsp.capabilities.card_payments === 'inactive' || rsp.capabilities.card_payments === 'inactive'){
            this.setState({
              isStripeAccount:false
            })
          } else {
            this.setState({
              isStripeAccount:true
            })
          }

        })
      } else {
        return false
      }
    } 
  }

  
    render() {
      console.log("Value of current user is %o", this.props.currentUserObj)
      let isConnectedAccount = this.state.isStripeAccount
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
    { signIn, signOut, checkLoginStatus }
  )(NewListing);
