import React, { Component } from 'react'
import StripeCheckout from '../components/StripeCheckout'
import Header from '../components/Header'
import queryString from 'query-string';

import { connect } from "react-redux";
import { signIn, signOut, checkLoginStatus } from "../actions";

class Checkout extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             queryParams:queryString.parse(this.props.location.search)
        }
    }
    
    componentDidMount(){
        console.log("In details page %o", this.props.match.params)
        this.props.checkLoginStatus()
        .then (()=>{
            console.log("Checked status")
        })
    }

    render() {
        return (
            <div>
                 <div className="header_other-pages">
                    <Header/>
                 </div>
                <div className = "ui container">
                        <StripeCheckout sessionId={this.state.queryParams}/>
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
  )(Checkout);