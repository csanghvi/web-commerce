import React, { Component } from 'react'
import ListingsDetails from "../components/ListingDetails"
import Header from "../components/Header"
import { connect } from "react-redux";
import { signIn, signOut, checkLoginStatus } from "../actions";


class Details extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
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
                        <ListingsDetails id={this.props.match.params}/>
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
  )(Details);
