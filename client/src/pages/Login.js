import React, { Component } from 'react'
import Header from "../components/Header"
import SignIn from "../components/SignIn"

export default class Home extends Component {
    render() {
        return (
            <div className="header_primary">
                <Header/>
                <div className="signin_container">
                        <SignIn />
                </div>
           </div>
        )
    }
}
