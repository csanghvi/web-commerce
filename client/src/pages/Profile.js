import React, { Component } from 'react'
import MyProfile from "../components/MyProfile"
import Header from "../components/Header"
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";


class Profile extends Component {
    render() {
        return (
            <div>
                 <div class="header_other-pages">
                    <Header/>
                 </div>
                {this.props.isSignedIn ?
                <React.Fragment>
                    <MyProfile />
                </React.Fragment>
                :  
                <React.Fragment>
                   <Redirect to="/login" />;
                </React.Fragment>}

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
  )(Profile);
