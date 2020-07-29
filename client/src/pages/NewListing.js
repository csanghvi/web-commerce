import React, { Component } from 'react'
import BuildListing from "../components/BuildListing"
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut, checkLoginStatus } from "../actions";
import SignUpAsASellerModal from "../components/SignUpAsASellerModal"
import apiClient from '../api/apiClient'
import {Segment, Image} from 'semantic-ui-react'
import expressOauth from '../img/express-oauth.png'
import HeaderComp from "../components/Header"

class NewListing extends Component {
  constructor(props) {
    super(props)
    this.props.checkLoginStatus()
    .then(() => {
      this.isAccountReady()
    })
    this.state = {
       isStripeAccount: true,
       selectAccountType: ''
    }
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
        this.setState({
          isStripeAccount:false
        })
        return false
      }
    } 
  }

  selectAccountType=(type)=>{
    this.setState({
      selectAccountType:type
    })
  }

  renderExpressApiCall = () =>{
    return (
      <Segment placeholder compact textAlign='center'>
        <Image src={expressOauth} />
    </Segment>
    )
  }
  
    render() {
      console.log("Value of current user is %o", this.props.currentUserObj)
      let isConnectedAccount = this.state.isStripeAccount
      let selectAccountType = this.state.selectAccountType
        return (
            <div>
                 <div className="header_other-pages">
                    <HeaderComp/>
                 </div>
                <div className = "ui container">
                    {this.props.isSignedIn ?
                      isConnectedAccount ?
                    <React.Fragment>
                        <BuildListing email={this.props.currentUserObj.email}/>
                    </React.Fragment>
                    : 
                    <React.Fragment >
                      <SignUpAsASellerModal selectAccountType={this.selectAccountType}/>
                    </React.Fragment>
                    :  
                    <React.Fragment>
                       <Redirect to="/login" />;
                    </React.Fragment>}

                    {(selectAccountType === 'express') &&
                      this.renderExpressApiCall()
                    }
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
