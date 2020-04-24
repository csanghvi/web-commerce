import React, { Component } from 'react'
import queryString from 'query-string'
import apiClient from '../api/apiClient'
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, signOut, accountSignIn } from "../actions";
import expressAccountUpdate from '../img/expressAccountUpdate.png'
import HeaderComp from "../components/Header"
import {Segment, Image, Button} from 'semantic-ui-react'


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

        })
        
      }
      renderExpressApiUpdate = () =>{
        return (
          <Segment placeholder compact textAlign='center'>
            <Image src={expressAccountUpdate} />
            <Button primary onClick={this.redirectToListing} style={{marginTop:'20px'}}> Continue Ahead </Button>
        </Segment>
        )
      }

      redirectToListing = () => {
        this.setState({
            isRedirected: true
        })
      }
    
    render() {
        return (
            <div>
                <div className="header_other-pages">
                <HeaderComp/>
                </div>
            <div className = "ui container">
                {this.state.isRedirected && <Redirect to ="/listings/new" />}
                {this.renderExpressApiUpdate()}
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
    { signIn, signOut, accountSignIn }
  )(OauthConnect);
