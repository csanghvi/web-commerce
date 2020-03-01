import React, { Component } from 'react'
import ListingsList from "../components/ListingsList"
import Header from "../components/Header"


export default class List extends Component {
    render() {
        return (
            <div>
                 <div class="header_other-pages">
                    <Header/>
                 </div>
                <div className = "ui container">
                        <ListingsList />
                </div>
           </div>
        )
    }
}
