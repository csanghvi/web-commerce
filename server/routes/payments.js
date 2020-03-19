const express = require("express");
const paymentRoutes = express.Router();
const [Listings, Users] = require("../models/data.model");

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = app => {
  app.use("/api/v1/payments", paymentRoutes);

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
              transfer_data: {
                destination: sellerObj.stripeAccountId,
              },
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
