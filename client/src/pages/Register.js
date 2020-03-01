import React, { Component } from 'react'
import Header from "../components/Header"
import SignUp from "../components/SignUp"

export default class Home extends Component {
    render() {
        return (
            <div class="header">
                <Header/>
                <div class="signin_container">
                        <SignUp />
                </div>
           </div>
        )
    }
}
