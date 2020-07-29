import React, { Component } from 'react'
import Header from "../components/Header"
import SignIn from "../components/SignIn"

export default class Home extends Component {
    render() {
        return (
            <div className="header_primary">
                <Header/>
                <div className='signin_banner'>
                <h1 className="banner_heading">
                        Sign in
                    </h1>
                    <p className='banner_label'>
                    <label className='supporting-text'>Login to your Stack Raise account</label></p>
                </div>
                <div className="signin_container">
                        <SignIn />
                </div>
           </div>
        )
    }
}
