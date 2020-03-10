import React, { Component } from 'react'
import ListingsList from "../components/ListingsList"
import Header from "../components/Header"


export default class List extends Component {
    constructor(props) {
        super(props)
        console.log('Props in list const is %o', props)
        this.state = {
             location:props.location.state.location || '',
             startDate: props.location.state.startDate || '',
             endDate: props.location.state.endDate || ''

        }
    }
    
    render() {
        return (
            <div>
                 <div className="header_other-pages">
                    <Header/>
                 </div>
                <div className = "ui container">
                        <ListingsList location={this.state.location} startDate={this.state.startDate} endDate={this.state.endDate}/>
                </div>
           </div>
        )
    }
}
