import React from 'react'
import {Component} from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

class Login extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          email: '',
          password: '',
          error: '',
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loginAsRenter = this.loginAsRenter.bind(this);
        this.loginAsSeller = this.loginAsSeller.bind(this);
      }

      handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
    
        this.setState({
          [name]: value,
        });
      }
    
      loginAsRenter() {
        this.setState({
          email: 'renter@kavholm.com',
          password: 'test',
        });
      }
    
      loginAsSeller() {
        this.setState({
          email: 'owner@kavholm.com',
          password: 'test',
        });
      }
    
      async handleSubmit(event) {

      }

    render() {
        return (
            <div className="login">
                <div>
                    <h2 class="heading-secondary">
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
                onClick={this.loginAsRenter}
              >
                Renter demo
              </button>
  
              <button
                className="btn btn-secondary btn-half right"
                onClick={this.loginAsSeller}
              >
                Owner demo
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
          </div>
  
         )
    }
}

export default Login