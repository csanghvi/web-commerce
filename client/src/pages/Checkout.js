import React, { Component } from 'react'
import StripeCheckout from '../components/StripeCheckout'
import Header from '../components/Header'
import queryString from 'query-string';


export default class Checkout extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             queryParams:queryString.parse(this.props.location.search)
        }
    }
    

    render() {
        return (
            <div>
                 <div class="header_other-pages">
                    <Header/>
                 </div>
                <div className = "ui container">
                        <StripeCheckout sessionId={this.state.queryParams}/>
                </div>
           </div>
        )
    }
}
