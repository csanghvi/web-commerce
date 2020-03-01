import React, { Component } from 'react'
import BuildListing from "../components/BuildListing"

import Header from "../components/Header"

export default class NewListing extends Component {
    render() {
        return (
            <div>
                 <div class="header_other-pages">
                    <Header/>
                 </div>
                <div className = "ui container">
                        <BuildListing />
                </div>
           </div>
        )
    }
}
