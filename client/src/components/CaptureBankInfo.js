import React, { Component } from 'react'
import apiClient  from "../api/apiClient"
import cookie from 'js-cookie';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

class CaptureBankInfo extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        routingNumber: '',
        bankAccountNumber: '',
        error: '',
      };
  
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
  
    async handleSubmit(event) {
      event.preventDefault();
      try {
        let res = await apiClient.register(this.state);
        console.log(res);
      } catch (err) {
        console.log('Signup failed.', err);
      }
    }

  
    render() {
      return (
          <div className="signup-form">
            <div>
                <h2 class="heading-secondary">
                    Create Payout Account
                </h2>
            </div>
            <form onSubmit={this.handleSubmit}>
              <input
                className="new-section name form__input"
                type="text"
                id="routingNumber"
                name="routingNumber"
                placeholder="Routing Number"
                value={this.state.routingNumber}
                onChange={this.handleChange}
                required
              />
  
              <input
                className="name form__input"
                type="text"
                id="bankAccountNumber"
                name="bankAccountNumber"
                placeholder="Bank Account Number"
                value={this.state.bankAccountNumber}
                onChange={this.handleChange}
                required
              />
  
              <button type="submit" className="btn btn-primary btn-full">
                Create account
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
)(CaptureBankInfo);
