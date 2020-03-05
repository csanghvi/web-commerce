const express = require('express');
const paymentRoutes = express.Router();
const [ , Users] = require('../models/data.model');

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = (app) => {

    app.use('/api/v1/payments', paymentRoutes);

    paymentRoutes.route('/create-payment-intent').post(async function(req, res) {
        console.log("Received payment intent Req %o", req.body);
        Users.findOne({email:req.body.email}, async function(err, user) {
          if (!user){
              res.status(400).send('User not found');
          } else {

            /*
            Check if a customer object on Stripe is already created, if not, create one.
            https://stripe.com/docs/api/customers
            I can choose to create customer object without any fields as well to maintain customer
            anonymity
            */
           if (Object.prototype.hasOwnProperty.call(user, "stripeCustomerObj")) {
              var customerObj = await stripe.customers.create({
                email: user.email
              });
            
            const stripeCustomerObj = {
              id:customerObj.id,
              currency: customerObj.currency,
              created: customerObj.created,
              sources: customerObj.sources,
              subscriptions: customerObj.subscriptions
            }

            Users.update({_id: user.id}, {
                stripeCustomerObj: stripeCustomerObj
                }, function(err, affected, resp) {
                console.log(resp);
                })
            }

            /*
            Get the pricing from database for the event
            TODO
            const calculateOrderAmount = items => {
              // Replace this constant with a calculation of the order's amount
              // Calculate the order total on the server to prevent
              // people from directly manipulating the amount on the client
              return 1400;
            };
            const amount = await calculateOrderAmount()
            */
           

            /*
            Creat Payment Intent
            */
            const paymentIntent = await stripe.paymentIntents.create({
              amount: 1099,
              currency: 'usd',
              // Verify your integration in this guide by including this parameter
              metadata: {
                integration_check: 'accept_a_payment'
              },
            });

              res.status(200).json({clientSecret: paymentIntent.client_secret, user:user.email})
          }
    });

  })


  paymentRoutes.post("/checkout-session", async (req, res) => {
    const data = req.body
    console.log("Received request to create session %o", data)
    const amount = data.amount*100
    try {
        const session = await stripe.checkout.sessions.create({
              success_url: `${process.env.STRIPE_CHECKOUT_DOMAIN}/checkout?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${process.env.STRIPE_CHECKOUT_DOMAIN}/listings/${data.listingId}`,
              payment_method_types: ['card'],
              line_items: [
                {
                  name: "Listing Name",
                  amount: 1000,
                  currency: "usd",
                  quantity: data.quantity,
                  images: ["https://images.pexels.com/photos/2283996/pexels-photo-2283996.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"]
                },
              ],
         })
         console.log("Created session object is %o", session.id);
        res.status(200).json({sessionId:session.id})
    } catch (err) {
      console.log("Error is %o", err);
    }
  
  })

  paymentRoutes.get("/checkout-session", async (req, res) => {
    console.log('TEST')
    let sessionId = req.query.sessionId;
    console.log("Session id is %o", sessionId)
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        console.log("Created session object is %o", session.id);
        res.status(200).json({session:session})
    } catch (err) {
      console.log("Error is %o", err);
    }
  
  })

return paymentRoutes;
}

