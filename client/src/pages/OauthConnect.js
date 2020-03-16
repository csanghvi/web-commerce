import React, { Component } from 'react'
import queryString from 'query-string'
import apiClient from '../api/apiClient'
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut, accountSignIn } from "../actions";

class OauthConnect extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            isRedirected:false
        }
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        console.log(" Value of code is %o", values.code) // "top"
        console.log(" Value of state is %o",values.state) // "im"
        //console.log("Params for redirect are %o", this.props.match.params.id)
        apiClient.oAuth("testing", values.code, )
        .then(rsp => {
            console.log("Recevied response is %o", rsp)
            this.props.accountSignIn(rsp.data.user)
            this.setState({
                isRedirected: true
            })
        })
        
      }
    
    render() {
        return (
            <div>
                {this.state.isRedirected && <Redirect to ="/listings/new" />}
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
    { signIn, signOut, accountSignIn }
  )(OauthConnect);
