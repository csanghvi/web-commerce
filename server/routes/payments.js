const express = require("express");
const paymentRoutes = express.Router();
const [Listings, Users] = require("../models/data.model");

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = app => {
  app.use("/api/v1/payments", paymentRoutes);

  paymentRoutes.route("/create-subscription").post(async function(req, res) {
    console.log("Received payment intent Req %o", req.body);
    const data = req.body
    Users.findOne({ email: req.body.email }, async function(err, user) {
      if (!user) {
        res.status(400).send("User not found");
      } else {
        /*
            Get the pricing from database for the event
            */
        try {
            /*
            Creat Payment Intent
            */

           await stripe.paymentMethods.attach(data.pm,
            {customer: data.stripeCustomerId});

           await stripe.customers.update(
            data.stripeCustomerId,
            {
              invoice_settings: {default_payment_method : data.pm}
            });

            if (data.coupon) {

            }

            /*
              If a plan has a trial period, subscription without a trial_period_days ignore the trial period on the plan
              'trial_period_days' This is almost a mandatory field if plan has a trial period.
              Now, if this field is present, paymentIntent is not created & instead a setupIntent is used by default.
              if No further actions are needed, no SCA, then the flow can be marked successful if subscription state changes
              & pending_setup_intent is null.
            */

            /*
            trial_end
            optional
            Unix timestamp representing the end of the trial period the customer will get before being charged for the 
            first time. This will always overwrite any trials that might apply via a subscribed plan. 
            If set, trial_end will override the default trial period of the plan the customer is being subscribed to. 
            The special value now can be provided to end the customer’s trial immediately. 
            Can be at most two years from billing_cycle_anchor.

            trial_from_plan
            optional
            Indicates if a plan’s trial_period_days should be applied to the subscription. 
            Setting trial_end per subscription is preferred, and this defaults to false. 
            Setting this flag to true together with trial_end is not allowed.

            trial_period_days
            optional
            Integer representing the number of trial period days before the customer is charged for the first time. 
            This will always overwrite any trials that might apply via a subscribed plan.
            */

           var trial_days = data.hasFreeTrial || 0
           
           
           const subscription = await stripe.subscriptions.create({
            customer: data.stripeCustomerId,
            trial_period_days:trial_days,//===>Because of a trial period
            items: [
              {
                plan: data.plan,
              },
            ],
            default_payment_method: data.pm,
            expand: ['latest_invoice.payment_intent'],
            coupon: data.coupon
          });

          if (data.plan === 'plan_GwOwMDrjthVeVS') {
            console.log("Sending metered billing subscription")
            const subscription2 = await stripe.subscriptions.create({
              customer: data.stripeCustomerId,
              
              items: [
                {
                  plan: 'plan_GwOzloDXjMNvYJ',
                },
              ],
              default_payment_method: data.pm,
              expand: ['latest_invoice.payment_intent'],
            });
          }

          var status = ''
          if (subscription.status === 'trialing') {
            if (subscription.pending_setup_intent) {
              let psi = await stripe.setupIntents.retrieve(
                subscription.pending_setup_intent);

              res.status(200).json({ status:'setup', subscription: subscription, psi: psi.client_secret});
            } else {
              res.status(200).json({ status:'setup', subscription: subscription});
            }
          } else if (subscription.status === 'active') {
            if (subscription.latest_invoice.paymentIntent.status === "requires_action") {
              status = 'requires_action'

              res.status(200).json({ status:'charge', subscription: subscription, pi: subscription.latest_invoice.paymentIntent.client_secret});
            } else {
              res.status(200).json({ status:'charge', subscription: subscription});
            }
          } else {
            console.log("Subscription status is %o", subscription.status)
            res.status(200).json({ status: subscription.status});
          }
            console.log("paymentIntent Obj is %o", subscription.pending_setup_intent)

            
           
        } catch (err) {
          console.log("Error with finding listing %o",err)
          res
          .status(400)
          .json({ error: "Failed to Create intent. Listing not found" });
        }
      }
    });
  });


  paymentRoutes.route("/create-payment-intent").post(async function(req, res) {
    console.log("Received payment intent Req %o", req.body);
    const data = req.body
    Users.findOne({ email: req.body.email }, async function(err, user) {
      if (!user) {
        res.status(400).send("User not found");
      } else {
        /*
            Get the pricing from database for the event
            */
        try {
          const listingObj = await Listings.findOne({
            _id: data.listingId
          });
          console.log("Listing Obj is %o", listingObj)

          const sellerObj = await Users.findOne({email: listingObj.email})

          if (listingObj) {
            /*
            Creat Payment Intent
            */
            const paymentIntent = await stripe.paymentIntents.create({
              amount: Number(data.amount*100),
              currency: "usd",
              customer: data.stripeCustomerId,
              application_fee_amount: Number(data.amount*100*0.05),
              statement_descriptor_suffix:sellerObj.email,
              transfer_data: {
                destination: sellerObj.stripeAccountId,
              },
              //on_behalf_of: sellerObj.stripeAccountId,
              // Verify your integration in this guide by including this parameter
              metadata: {
                listingId: listingObj.id,
                listingTitle: listingObj.title,
                qty: data.listingQty,
                userEmail: user.email,
                selectedDate: data.selectedDate
              }
            });

            console.log("paymentIntent Obj is %o" ,paymentIntent.client_secret)

            res.status(200).json({ clientSecret: paymentIntent.client_secret });
          } else {
            res
              .status(400)
              .json({ error: "Failed to Create intent. Listing not found" });
          }
        } catch (err) {
          console.log("Error with finding listing %o",err)
          res
          .status(400)
          .json({ error: "Failed to Create intent. Listing not found" });
        }
      }
    });
  });

  paymentRoutes.post("/checkout-session", async (req, res) => {
    const data = req.body;
    console.log("Received request to create session %o", data);
    const amount = data.amount * 100;
    try {
      var userObj = await Users.findOne({ email: data.email }) 
      var listingObj = await Listings.findOne({ _id: data.id })   
      var sellerObj = await Users.findOne({email: listingObj.email})
      console.log("ListingObj details are %o %o, %o, %o %o", listingObj.id, listingObj.title, userObj._id, data.quantity, listingObj.images[0])

      const session = await stripe.checkout.sessions.create({
        success_url: `${process.env.STRIPE_CHECKOUT_DOMAIN}/checkout?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.STRIPE_CHECKOUT_DOMAIN}/listings/${data.id}`,
        payment_method_types: ["card"],
        customer: userObj.stripeCustomerId,
        payment_intent_data: {
          application_fee_amount: Number(data.amount*100*0.05),
          transfer_data: {
            destination: sellerObj.stripeAccountId,
          },
          metadata: {
            listingId: listingObj.id,
            listingTitle: listingObj.title,
            qty: data.quantity,
            userEmail: userObj.email,
            selectedDate: data.selectedDate
          }
        },
        line_items: [
          {
            name: listingObj.title,
            description: listingObj.title,
            amount: Number(data.amount*100),
            currency: "usd",
            quantity: data.quantity,
            images: [listingObj.images[0]]
          }
        ]
      });
      console.log("Created session object is %o", session.id);
      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.log("Error is %o", err);
    }
  });

  paymentRoutes.get("/checkout-session", async (req, res) => {
    console.log("TEST");
    let sessionId = req.query.sessionId;
    console.log("Session id is %o", sessionId);
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log("Created session object is %o", session.id);
      res.status(200).json({ session: session });
    } catch (err) {
      console.log("Error is %o", err);
    }
  });

  return paymentRoutes;
};
