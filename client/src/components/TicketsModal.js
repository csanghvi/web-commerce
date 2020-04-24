import React from 'react';
import ReactDOM, { render } from 'react-dom';
import Modal from 'react-modal';
import Checkout from './Checkout'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import apiClient from '../api/apiClient'
import Stripe from 'stripe';
import Popup from './Popup.js'

const stripePromise = loadStripe('pk_test_XvODp9OF6PFNt7Yka7dieFYp00MTqbXTDK')
const stripe = window.Stripe('pk_test_XvODp9OF6PFNt7Yka7dieFYp00MTqbXTDK')

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '30%',
    height                : 'auto'
    
  }
};

class TicketsModal extends React.Component {
  constructor(props) {
    super(props)
    this.setIsOpen = this.setIsOpen.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.paymentResult = this.paymentResult.bind(this)
    this.state = {
       clientSecret:'',
       isOpen:false,
       paymentResult:'', 
       receiptUrl:'',
       paymentIntent:''
    }
  }
  setIsOpen (flag){
    this.setState({
      isOpen:flag
    })
  }

   componentDidMount(){
    console.log("Event id is %o", this.props.id)
  }

  async openModal() {
    //Create Payment Intent
    this.setIsOpen(true);
  }
 
 
  closeModal(){
    this.setIsOpen(false);
  }

  paymentResult (result) {
    this.setState({
      paymentResult:result,
      isOpen:false
    })
  }

  initiateCheckout = async (event) => {
    event.preventDefault();
    /* Fetches information from the server to set up the page */
    try {
      console.log("Props id is %o", this.props.id)
    var rawResponse = await apiClient.createCheckoutSession(this.props.id, this.props.totalAmount, this.props.selectedQuantity, this.props.selectedDate)
      console.log("Resulting session id is %o", rawResponse.data.sessionId)
    } catch (err){
      console.log("Err in creating a checkout session %o", err)
    }
    try {
      var stripeCheckout = await stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: rawResponse.data.sessionId
      })
      console.log("value of stripecheckout is %o", stripeCheckout)
    } catch ( err ) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
        console.log('Display error to user %o', err)
    }
  }

  setPaymentIntent = async (data) => {

   var result = await apiClient.retrievePaymentIntent(data)
    console.log('Retrieved intent is %o', result)
    this.setState({
      paymentIntent:data,
      receiptUrl:result.charges.data[0].receipt_url
    })

  }

   render() {
    const clientSecret = this.state.clientSecret
    var paymentResult = this.state.paymentResult
    var successStyle
    var element
    if (paymentResult === "succeeded"){
      /*
      Get receipt url
      */
      paymentResult = `Payment successfully completed. Your ticket will be emailed to you at ${this.props.buyer}.`

      element = <h3>{paymentResult} <br/>Check receipt <a style={{color:'blue'}} target='_blank' href={this.state.receiptUrl}> here</a></h3>
      successStyle = {
        color:"green",
        fontSize:"1.4rem",
        fontWeight:"700"
      }
    } else if (paymentResult === "failed"){
      paymentResult = `Payment attempt failed.`
      successStyle = {
        color:"red",
        fontSize:"1.4rem",
        fontWeight:"700"
      }
    element=<h3>{paymentResult}</h3>
    }
    console.log ('Client secret is %o', clientSecret)
    return (
      <div>
      { paymentResult ? 
      <React.Fragment>
        <span style={successStyle}>
          {element}
        </span>
      </React.Fragment>
       : 
      <React.Fragment>
         <Popup openModal={this.openModal} selectedQuantity={this.props.selectedQuantity}/>          
          <Modal
            appElement={document.querySelector('#app')}
            isOpen={this.state.isOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Payment Modal"
            ariaHideApp={false}
          >
            {this.state.isOpen &&
              <Elements stripe={stripePromise}>
                <Checkout id={this.props.id} setPaymentIntent={this.setPaymentIntent} paymentResult={this.paymentResult} totalAmount={this.props.totalAmount} quantity={this.props.selectedQuantity} selectedDate={this.props.selectedDate}/>
              </Elements>
            }
          </Modal>
          <button onClick={this.initiateCheckout} className="btn btn-half" disabled={!(this.props.selectedQuantity > 0)}>Use stripe checkout</button>
        </React.Fragment> 
        }
      </div>
    );
  }
}


export default TicketsModal