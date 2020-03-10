import React, { Component } from 'react'
import BuildListing from "../components/BuildListing"
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

import Header from "../components/Header"

class NewListing extends Component {
    render() {
        return (
            <div>
                 <div class="header_other-pages">
                    <Header/>
                 </div>
                <div className = "ui container">
                    {this.props.isSignedIn ?
                    <React.Fragment>
                        <BuildListing />
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
    { signIn, signOut }
  )(NewListing);
