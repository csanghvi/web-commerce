import React from 'react'
import { Component } from 'react';
import { connect } from "react-redux";
import { signIn, signOut, setRelayUrl } from "../actions";
import { Redirect } from "react-router-dom";

class SignIn extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          email: '',
          password: '',
          error: this.props.loginError,
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loginAsBuyer = this.loginAsBuyer.bind(this);
        this.loginAsSeller = this.loginAsSeller.bind(this);
        this.redirectAfterLogin = this.redirectAfterLogin.bind(this);
      }

      handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
    
        this.setState({
          [name]: value,
        });
      }
    
      loginAsBuyer() {
        this.setState({
          email: 'buyer@cbs.com',
          password: 'buyer@cbs.com',
        });
      }
    
      loginAsSeller() {
        this.setState({
          email: 'seller@cbs.com',
          password: 'seller@cbs.com',
        });
      }
    
      async handleSubmit(event) {
        event.preventDefault();
        try {
          this.props.signIn(this.state.email, this.state.password);
        } catch (err) {
          console.log('Signin failed.', err);
        }

      }

    redirectAfterLogin = () => {
      if (this.props.isSignedIn) {
        if (this.props.relayUrl){
          return <Redirect to={this.props.relayUrl} />;
        } else {
          return <Redirect to="/profile" />;
        }
      }
    }



    render() {
        return (
            <div className="login">
                <div>
                    <h2 className="heading-secondary">
                        Sign in
                    </h2>
                </div>
            <p className="supporting-text">
              You can sign in with your own account, or use one of our demo
              accounts.
            </p>
            <form onSubmit={this.handleSubmit}>
              <button
                className="btn btn-secondary btn-half"
                onClick={this.loginAsBuyer}
              >
                Buyer demo
              </button>
  
              <button
                className="btn btn-secondary btn-half right"
                onClick={this.loginAsSeller}
              >
                Seller demo
              </button>
              <input
                className="icon-input new-section form__input"
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
              />
              <input
                className="icon-input form__input"
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleChange}
              />
  
              <button type="submit" className="btn btn-primary btn-full">
                Sign in
              </button>
  
              <p className={`error ${this.state.error && 'show'}`}>
                {this.state.error && `Error: ${this.state.error}`}
              </p>
            </form>
            {this.redirectAfterLogin()}
          </div>
  
         )
    }
}

const mapStateToProps = state => {
  return {
    currentUserObj: state.auth.userObj,
    isSignedIn: state.auth.isSignedIn,
    loginError: state.auth.loginError,
    relayUrl: state.relay.relayUrl
  };
};

export default connect(
  mapStateToProps,
  { signIn, signOut, setRelayUrl }
)(SignIn);