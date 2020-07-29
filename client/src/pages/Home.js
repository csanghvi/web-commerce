import React, { Component } from 'react'
import Header from "../components/Header"
import Search from "../components/Search"
import jumbo from '../img/jumbotron.png'
import {Image} from 'semantic-ui-react'
import loggedinjumbo from '../img/loggedinjumbo.png'
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

class Home extends Component {
    render() {
        return (
            <div>
                <Header hideSearch={true}/>
                <div>
                    {this.props.isSignedIn ?
                    <React.Fragment>
                        <Image src={loggedinjumbo} />
                    </React.Fragment>
                    :  
                    <React.Fragment>
                       <Image src={jumbo} />
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
  )(Home);