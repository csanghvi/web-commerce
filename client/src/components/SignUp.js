import React, { Component } from 'react'
import apiClient  from "../api/apiClient"
import cookie from 'js-cookie';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

class SignUp extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        error: '',
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.redirectToProfile = this.redirectToProfile.bind(this);
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
        
        this.props.signIn(this.state.email, this.state.password);
      } catch (err) {
        console.log('Signup failed.', err);
      }
    }

    redirectToProfile = () => {
      if (this.props.isSignedIn) {
        return <Redirect to="/profile" />;
      }
    };
  
    render() {
      return (
          <div className="signup-form">
            <div style={{marginTop:'80px'}}>
                <h2 class="heading-secondary">
                Get started in minutes
                </h2>
                <span style={{marginTop:'80px', marginBottom:'40px'}}></span>
            </div>
            
            <form onSubmit={this.handleSubmit}>
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
                className="name formentry"
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
                className=" formentry"
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
                required
              />
  <p style={{marginTop:'10px'}}></p>              
            <input
                className=" formentry"
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
  <p style={{marginTop:'10px'}}></p>
                <button type="submit" className="btn btn-primary btn-full">
                Create account
              </button>
  
              <p className={`error ${this.state.error && 'show'}`}>
                {this.state.error && `Error: ${this.state.error}`}
              </p>
            </form>
            {this.redirectToProfile()}
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
)(SignUp);
