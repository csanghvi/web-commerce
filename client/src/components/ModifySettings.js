import React, { Component } from 'react'
import { Redirect, Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";
import apiClient  from "../api/apiClient"


class ModifySettings extends Component {
    constructor(props) {
        super(props);

      
        this.state = {
          firstName: this.props.currentUserObj.firstName || '',
          lastName: this.props.currentUserObj.lastName || '',
          email: this.props.currentUserObj.email || '',
          loginLink: '',
          error: '',
          customAccountLink:'',
          isCustom: false
        };
        //this.isStripeAccount()
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
  
      }
    
      handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
    
        this.setState({
          [name]: value,
        });
      }


      isStripeAccount = async () => {
        if (this.props.isSignedIn){
          let isStripeAccount = Object.prototype.hasOwnProperty.call(this.props.currentUserObj, "stripeAccountId") ? true : false
          if (isStripeAccount){
            apiClient.getStripeAccountStatus(this.props.currentUserObj.stripeAccountId)
            .then(rsp => {
              if (rsp.type === 'custom'){
                apiClient.getCustomAccountLink(this.props.currentUserObj.stripeAccountId, 'custom_account_update')
                .then(stripeRsp => {
                  console.log('Url is %o', stripeRsp.url)
                  this.setState({
                    isCustom:true,
                    customAccountLink:stripeRsp.url
                  })
                })
              } else {
                apiClient.createLoginLink(
                  this.props.currentUserObj.stripeAccountId
                )
                .then(loginLink => {
                  console.log("Login link received is %o", loginLink)
                  this.setState({
                      loginLink: `${loginLink.data.url}#/account`,
                      error: ''
                  })
                })
              }    
            })
          } else {
            return false
          }
        } 
      }
    
      async handleSubmit(event) {
        event.preventDefault();
        try {
          let res = await apiClient.updateAccount(this.state);
          console.log(res);
          
          this.props.signIn(this.state.email, this.state.password);
        } catch (err) {
          console.log('Signup failed.', err);
        }
      }


      componentDidMount() {
        this.isStripeAccount()
      }
    
      render() {
        let redirectLink = this.state.isCustom ? this.state.customAccountLink : this.state.loginLink
        let payoutLink = this.state.isCustom ? '/bank-account': this.state.loginLink
        return (
            <div className="signup-form">
              <div style={{marginTop:'80px'}}>
                  <h2 className="heading-secondary">
                      Update your account
                  </h2>
              </div>
              <form onSubmit={this.handleSubmit}>
              <p style={{marginTop:'10px'}}></p>
                <input
                  className="formentry"
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={this.state.firstName}
                  onChange={this.handleChange}
                  required
                />
                <p style={{marginTop:'10px'}}></p>
    
                <input
                  className="formentry"
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={this.state.lastName}
                  onChange={this.handleChange}
                  required
                />
                <p style={{marginTop:'10px'}}></p>
                <input
                  className="formentry"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
    
                <h2
                  
                ><a className="stripe-dashboard" href={redirectLink} target="_blank">Update stripe account</a>
                </h2>
                <h2
                >
                  {this.state.isCustom ? 
                  <Link to = '/bank-account' style={{color:'green'}}> Update payout account</Link>
                  :
                  <a className="stripe-dashboard" href={this.state.loginLink} target="_blank">Update payout account</a>
                  }
                </h2>
    
                <button type="submit" className="btn btn-primary btn-full">
                  Update account
                </button>
    
                <p className={`error ${this.state.error && 'show'}`}>
                  {this.state.error && `Error: ${this.state.error}`}
                </p>
              </form>
            </div>
          );
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
  )(ModifySettings);
  
