import React, { Component } from 'react'
import apiClient  from "../api/apiClient"
import cookie from 'js-cookie';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut, accountSignIn } from "../actions";
import { Dropdown } from 'semantic-ui-react'


const accountTypeOptions = [
    { key: 1, text: 'Individual', value: 'individual' },
    { key: 2, text: 'Company', value: 'company' }
  ]


 const validateForm = (params) => {
     var errors = []
    if ( params.routingNumber ) {
        errors.push('Please enter routing number')
    }
    if ( params.bankAccountNumber ) {
        errors.push('Please enter bank account number')
    }
    if ( params.accountHolderName ) {
        errors.push('Please enter account holder name')
    }
    if ( params.accountHolderType ) {
        errors.push('Please enter account holder type')
    }

    return errors;

 } 

class CaptureBankInfo extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        routingNumber: '',
        bankAccountNumber: '',
        accountHolderName: '',
        accountHolderType: '',
        error: '',
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleDDChange = this.handleDDChange.bind(this);
    }
  
    handleChange(event) {
      const target = event.target;
      const name = target.name;
      const value = target.value;
  
      this.setState({
        [name]: value,
      });
    }

    handleDDChange (e, { value }) {
        console.log('Value is %o', value)
        this.setState({ 
            accountHolderType: value 
        })
    }
  
    async handleSubmit(event) {
      event.preventDefault();
      let errors = validateForm(this.state)
      if (errors.length > 0) {
        this.setState({
            errors: errors
        })
      }
      try {
        let res = await apiClient.createBankAccountToken(this.state);
        apiClient.updateBankAccountDetails(res)
        .then(res => {
            console.log('Status is %o', res.user)
            this.props.accountSignIn(res.user)
        })
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
                className="name form__input"
                type="text"
                id="accountHolderName"
                name="accountHolderName"
                placeholder="Account Holder Name"
                value={this.state.accountHolderName}
                onChange={this.handleChange}
                required
              />

            <Dropdown
                onChange={this.handleDDChange}
                options={accountTypeOptions}
                placeholder='Choose an option'
                selection
                value={this.state.accountHolderType}
                className="name form__input"
              />

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
                Add bank account
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
  { signIn, signOut, accountSignIn }
)(CaptureBankInfo);
