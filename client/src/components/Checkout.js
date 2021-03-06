import React, { useState, useEffect } from 'react';
import { Form, Dropdown, Button, Popup, Grid, Image } from "semantic-ui-react"
import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { connect } from 'react-redux';
import { signIn, signOut, setRelayUrl } from "../actions";
import apiClient from '../api/apiClient'
import confirmElements from '../img/confirmcard_elements.png'
import confirmPM from '../img/confirmcard_pm.png'


const PopupSubmitPayment = (props) => (
  <Popup trigger={<Button onClick={props.handleSubmit} style={{background:'blueviolet', color:'white'}} className="btn btn-full"><span id="button-text">Submit Payment</span></Button>} 
 wide='very' basic hoverable position='bottom right' style={{marginTop:'250px', marginRight:'200px'}}>
    <Grid centered divided columns={1}>
      <Grid.Column textAlign='center'>
          {!props.existing ? 
          <Image src={confirmElements}></Image>
          :
          <Image src={confirmPM}></Image>
          }
      </Grid.Column>
    </Grid>
  </Popup>
)


const couponOptions = [
  { key: '25OFF', text: '25OFF', value: '25OFF' },
  { key: 'FREETRIAL', text: 'FREETRIAL', value: 'FREETRIAL' },
  { key: '5OFF', text: '5OFF', value: '5OFF' },
]

// Custom styling can be passed to options when creating an Element.
const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
          iconColor: 'blueviolet',
          color: 'black',
          fontWeight: 500,
          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          boxSizing: 'border-box',
          padding: '10px 12px',

          border: '1px solid transparent',
          borderRadius: '4px',
         
          '::placeholder': {
            color: 'blueviolet',
          },
          padding: '1em'
        },
        invalid: {
          iconColor: '#FFC7EE',
          color: '#FFC7EE',
        },
      },
};

const CheckoutForm = (props) => {
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [saveCard, setSaveCard] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [existingCard, setExistingCard] = useState(null);
  const [paymentOption, setPaymentOption] = useState('new');
  const [couponCode, setCouponCode] = useState(null);
  const [displayCardOptions, setDisplayCardOptions] = useState(false);


  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Update the document title using the browser API
    if (props.type === "subscription") {

    } else {
      apiClient
        .createPaymentIntent({
          stripeCustomerId: props.currentUserObj.stripeCustomerId,
          listingId: props.id,
          quantity: props.quantity,
          amount: props.totalAmount,
          selectedDate: props.selectedDate,
          insurance:props.insurance
        })
        .then(res => {
          console.log("Res of createPaymentIntent %o", res);
          setClientSecret(res.data.clientSecret);
          console.log("props.clientSecret is %o", clientSecret);
          apiClient
            .fetchCustomerPaymentMethods(props.currentUserObj.stripeCustomerId)
            .then(cardData => {
              if (cardData) {
                console.log("Setting cards %o", cardData);
                setExistingCard(cardData);
              } 
              setDisplayCardOptions(true)
            });
        })

        .catch(err => {
          console.log("Payment Intent could not be created.", err);
        });
    }
    /*
      Set Redux value for clientSecret
      Or create a new intent everytime user opens this dialogbox
    */
  }, []);

  // Handle real-time validation errors from the card Element.
  const handleChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  }

  // Handle form submission.
  const handleSubmit = async event => {
    event.preventDefault();
    setProcessing(true)
    if (paymentOption === "new") {
      var card = elements.getElement(CardElement);
      var result = await stripe.createToken(card);

      if (result.error) {
        // Inform the user if there was an error.
        setError(result.error.message);
      } else {
        setError(null);
        // Send the token to your server.
        console.log("client secret is %o", clientSecret);
        if (props.type === "subscription") {
          stripe
            .createPaymentMethod({
              type: "card",
              card: card,
              billing_details: {
                name: `${props.currentUserObj.firstName} ${props.currentUserObj.lastName}`,
                email: props.currentUserObj.email
              }
            })
            .then(function(result) {
              if (result.error) {
                // Show error to your customer
                setError(result.error.message);
              } else {
                // The payment has been processed!
                //response.paymentIntent && response.paymentIntent.status === 'succeeded'

                /*
              Create subscription server call returns
              {status, subscription, pi/psi}
            */
                console.log("Result is %o", result.paymentMethod.id);
                apiClient
                  .createSubscription({
                    stripeCustomerId: props.currentUserObj.stripeCustomerId,
                    plan: props.id,
                    nickname: props.nickname,
                    hasFreeTrial: props.hasFreeTrial,
                    amount: props.amount,
                    pm: result.paymentMethod.id,
                    coupon: couponCode
                  })
                  .then(rsp => {
                    console.log("props.clientSecret is %o", rsp.subscription);
                    if (rsp.status === "setup") {
                      if (rsp.subscription.pending_setup_intent) {
                        stripe.confirmCardSetup(rsp.psi).then(function(result) {
                          if (result.error) {
                            setError(result.error.message);
                          } else {
                            setStatus(rsp.subscription.status);
                            props.paymentResult(rsp.subscription);
                          }
                        });
                      } else {
                        setStatus(rsp.subscription.status);
                        props.paymentResult(rsp.subscription);
                      }
                    } else {
                      //It was a charge
                      if (
                        rsp.subscription.latest_invoice.paymentIntent.status ===
                        "requires_action"
                      ) {
                        stripe
                          .confirmCardPayment(rsp.pi, {
                            payment_method:
                              rsp.subscription.latest_invoice.paymentIntent
                                .payment_method
                          })
                          .then(function(result) {
                            if (result.error) {
                              setError(result.error.message);
                            } else {
                              setStatus(rsp.subscription.status);
                              props.paymentResult(rsp.subscription);
                            }
                          });
                      } else {
                        setStatus(rsp.subscription.status);
                        props.paymentResult(rsp.subscription);
                      }
                    }
                  })

                  .catch(err => {
                    console.log("Payment Intent could not be created.", err);
                  });
              }
            });
        } else {
          stripe
            .confirmCardPayment(clientSecret, {
              payment_method: {
                card: card
              },
              receipt_email: props.currentUserObj.email,
              setup_future_usage: saveCard ? "off_session" : ""
            })
            .then(function(result) {
              if (result.error) {
                // Show error to your customer
                setError(result.error.message);
              } else {
                // The payment has been processed!
                //response.paymentIntent && response.paymentIntent.status === 'succeeded'
                console.log("Result is %o", result.paymentIntent);
                setStatus(result.paymentIntent.status);
                props.paymentResult(result.paymentIntent.status);
                props.setPaymentIntent(result.paymentIntent.id)

              }
            });
        }
      }
    } else {
      stripe
      .confirmCardPayment(clientSecret, {
        payment_method: existingCard.id,
      })
      .then(function(result) {
        if (result.error) {
          // Show error to your customer
          setError(result.error.message);
        } else {
          // The payment has been processed!
          //response.paymentIntent && response.paymentIntent.status === 'succeeded'
          console.log("Result is %o", result.paymentIntent);
          setStatus(result.paymentIntent.status);
          props.paymentResult(result.paymentIntent.status);
          props.setPaymentIntent(result.paymentIntent.id)
        }
      });
      

    }
  };

const selectCoupon = (e,data) => {
  console.log('Dropdown value selected is %o &data is %o', e.target, data.value)
  setCouponCode(data.value)
}

const renderCouponField = () => {
  let couponField = <span/>
  if (props.type === "subscription") {
  couponField = <Dropdown placeholder='Apply Coupon' fluid selection options={couponOptions} onChange={selectCoupon} />
  }
  return couponField
}

const handleSaveCard = () => {
  var tmp = !saveCard
  setSaveCard(tmp)
}

const renderLegalText = () => {
  if (saveCard) {
  return (
      <div className="sr-legal-text">
          Your card will be charge ${props.totalAmount}.00<span id="save-card-text"> and your card details will be saved to your account</span>.
      </div>
  )
  } else {
    return (

      <div className="sr-legal-text">
        Your card will be charge ${props.totalAmount}.00.
    </div>

    )
  }
}
const renderSubmitOrSpinner = () => {
  let existingVal = false 
  if (paymentOption === 'existing')
    existingVal = true

  if (processing) {
    return (
      <Button loading style={{background:'blueviolet', color:'white'}} className="btn btn-full"><span id="button-text">Submit Payment</span></Button>
    )
  } else {
    return (
    <PopupSubmitPayment handleSubmit={handleSubmit} existing={existingVal}/>
    )
  }

}

const displayPaymentOptions = () =>{
  const existingLabel = `Use card ending with ${existingCard.card.last4}`
    return (
      <div>
      <Form.Group inline>
          <label>How would you like to pay?</label>
          <Form.Radio label={existingLabel} checked={paymentOption === 'existing'} value="existing" onClick={() => setPaymentOption('existing')} />
          <Form.Radio label="Use a new card" checked={paymentOption === 'new'} value="new" onClick={() => setPaymentOption('new')} />
      </Form.Group>
    </div>
    )
}

const displayCardForm = () => {
  return (
    <div>
      <div>
        <div className="sr-combo-inputs-row" style={{borderStyle:"outset"}}>
        <CardElement
          id="card-element"
          options={CARD_ELEMENT_OPTIONS}
          onChange={handleChange}
        />
        </div>
        <div className="card-errors" role="alert" style={{color:"red"}}>{error}</div>
      </div>
      <div className="sr-form-row">
          <label className="sr-checkbox-label"><input type="checkbox" id="save-card" onClick={handleSaveCard}/> Save card for future payments</label>
      </div>
    </div>
  )
}
  return (
    <form onSubmit={handleSubmit}>
      {displayCardOptions ? 
      <React.Fragment>
      <div className="form-row">
        {existingCard ? 
        <React.Fragment>
        {displayPaymentOptions()}
        { (paymentOption === "new") &&
                <React.Fragment>
                {displayCardForm()}
              </React.Fragment>
        }
        </React.Fragment> 
        :
        <React.Fragment>
          {displayCardForm()}
        </React.Fragment> 
        }
      </div>
      <div className="card-errors" role="alert">{status}</div>
        {renderLegalText()}
       <div style={{marginTop:"8px"}}> {renderCouponField()}</div>
      <div className="submit-card-button">
        {renderSubmitOrSpinner()}
      </div>
      </React.Fragment>
      :
      <React.Fragment>
      <div />
      </React.Fragment>
      }
    </form>
  );
}


// POST the token ID to your backend.
async function stripeTokenHandler(token) {
  const response = await fetch('/charge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token: token.id})
  });

  return response.json();
}

const mapStateToProps = state => {
  return {
    currentUserObj: state.auth.userObj,
    isSignedIn: state.auth.isSignedIn,
    relayUrl: state.relay.relayUrl
  };
};

export default connect(
  mapStateToProps,
  { signIn, signOut, setRelayUrl }
)(CheckoutForm);