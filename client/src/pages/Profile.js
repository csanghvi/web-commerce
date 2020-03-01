import React, { Component } from 'react'
import MyProfile from "../components/MyProfile"
import Header from "../components/Header"


export default class Profile extends Component {
    render() {
        return (
            <div>
                 <div class="header_other-pages">
                    <Header/>
                 </div>
                <div className = "ui container">
                        <MyProfile />
                </div>
           </div>
        )
    }
}
