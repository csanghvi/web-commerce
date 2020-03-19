import React, { Component } from 'react'
import Header from "../components/Header"
import SignUp from "../components/SignUp"

export default class Home extends Component {
    render() {
        return (
            <div className="header_primary">
                <Header hideSearch={true}/>
                <div class="signin_container">
                        <SignUp />
                </div>
           </div>
        )
    }
}
