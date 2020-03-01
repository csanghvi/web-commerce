import React, { Component } from 'react'
import Header from "../components/Header"
import Search from "../components/Search"

export default class Home extends Component {
    render() {
        return (
            <div class="header">
                <Header/>
                <div class="signin_container">
                        <Search />
                </div>
           </div>
        )
    }
}
