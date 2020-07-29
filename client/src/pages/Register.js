import React, { Component } from 'react'
import Header from "../components/Header"
import SignUp from "../components/SignUp"

export default class Home extends Component {
    render() {
        return (
            <div className="header_primary">
                <Header hideSearch={true}/>
                <div className='signup_banner'>
                <h1 className="banner_heading">
                        Sign Up
                    </h1>
                </div>
                <div className="signin_container">
                        <SignUp />
                </div>
           </div>
        )
    }
}
