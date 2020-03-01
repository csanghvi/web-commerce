import React, { Component } from 'react'
import ListingsDetails from "../components/ListingDetails"
import Header from "../components/Header"


export default class List extends Component {
    render() {
        return (
            <div>
                 <div class="header_other-pages">
                    <Header/>
                 </div>
                <div className = "ui container">
                        <ListingsDetails id={this.props.match.params}/>
                </div>
           </div>
        )
    }
}
