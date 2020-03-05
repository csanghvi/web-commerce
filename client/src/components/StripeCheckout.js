import React, { Component } from 'react'
import * as qs from 'query-string';
import apiClient from '../api/apiClient';
import { Router, Link } from 'react-router-dom';


export default class StripeCheckout extends Component {
    constructor(props) {
        super(props)
        this.state = {
             sessionJSON: ""
        }
    }
    
    componentDidMount () {
        let currentComponent = this;
        console.log('Params is %o', this.props.sessionId.session_id)
        if (this.props.sessionId) {
            apiClient.getCheckoutSession(this.props.sessionId.session_id)
            .then(function(response){
                console.log('Session is %o', response)
              var sessionJSON = JSON.stringify(response.data.session, null, 2);
              currentComponent.setState({
                  sessionJSON:sessionJSON
              })
            })
            .catch(function(err){
              console.log('Error when fetching Checkout session', err);
            });
        }
    }
    render() {

        return (
            <div className="ui two column grid">
                <div className="column centered">
                    <h1>Your payment succeeded</h1>
                    <h4>
                        View CheckoutSession response:
                    </h4>
                    <div class="sr-section completed-view">
                        <div class="eco-callout">
                            <div>
                                {this.state.sessionJSON}
                            </div>
                        </div>
                        <button className="btn btn--full"><Link to='/listings'>Return to ticket purchase</Link></button>
                    </div> 
                </div>
                <div class="column centered">
                    <div class="pasha-image-stack">
                        <img
                        src="https://images.pexels.com/photos/2283996/pexels-photo-2283996.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                        width="275"
                        height="185"
                        />
                        <img
                        src="https://images.pexels.com/photos/2283996/pexels-photo-2283996.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                        width="275"
                        height="185"
                        />
                        <img
                        src="https://images.pexels.com/photos/2283996/pexels-photo-2283996.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                        width="275"
                        height="185"
                        />
                    </div>
                </div>
            </div>
        )
    }
}
