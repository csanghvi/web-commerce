import React, { Component } from 'react'
import Header from '../components/Header'
import { Redirect } from "react-router-dom";
import ModifySettings from '../components/ModifySettings'
import { connect } from "react-redux";
import { signIn, signOut, checkLoginStatus } from "../actions";

class Settings extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    componentDidMount () {
        console.log("In settings")
                this.props.checkLoginStatus()
        .then (()=>{
            console.log("Checked status")
        })
    }
    
    render() {
        return (
            <div className="header_primary">
                <Header/>
                <div class="signin_container">
                    {this.props.isSignedIn ?
                    <React.Fragment>
                        <ModifySettings />
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
    { signIn, signOut, checkLoginStatus }
  )(Settings);
