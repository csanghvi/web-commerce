const express = require("express");
const hooksRoutes = express.Router();
const [Listings, Users, Orders] = require("../models/data.model");
const stripe = require("../utils/stripeConfig");

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks

module.exports = app => {
  app.use("/api/hooks", hooksRoutes);

  hooksRoutes.post("", async (req, res) => {
    console.log("Received a hook");
    let data, eventType;

    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      data = event.data;
      eventType = event.type;
      console.log("Received a hook of Type %o", event.type);
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // we can retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }

    if (eventType === "payment_method.attached") {
      // The PaymentMethod is attached
      console.log("❗ PaymentMethod successfully attached to Customer");
    } else if (eventType === "payment_intent.succeeded") {
      if (data.object.setup_future_usage !== null) {
        // You need a Customer to save a card
        // Create or use a preexisting Customer
        //const customer = await stripe.customers.create({
        //  payment_method: data.object.payment_method
        //});
      } else {
        console.log("❗ Customer did not want to save the card. ");
      }

      // Funds have been captured
      // Fulfill any orders, e-mail receipts, etc
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
      console.log("💰 Payment captured! %o", data.object);
      var order = {
        listingId: data.object.metadata.listingId,
        listingTitle: data.object.metadata.listingTitle,
        stripeBuyer: data.object.stripeCustomer,
        dateOfPurchase: data.object.created,
        amount: data.object.amount,
        qty: data.object.metadata.qty,
        email: data.object.metadata.userEmail,
        selectedDate: data.object.metadata.selectedDate,
        insurance: data.object.metadata.type === 'sct' ? true : false
      };
      
      if (
        Object.prototype.hasOwnProperty.call(data.object, "transfer_data") &&
        data.object.transfer_data !== null
      ) {
        order.stripeSeller = data.object.transfer_data.destination
      }

        let orderObj = new Orders(order);
        orderObj.save()
        .then (async ord => {
          console.log('Order id is %o', ord._id)
          if (data.object.metadata.type === 'sct') {
            await stripe.paymentIntents.update(
              data.object.id,
              {transfer_group: ord._id.toString()}
            );
            let transferAmount = Number.parseFloat((data.object.amount/100 - 10*data.object.metadata.qty) - (0.05 * data.object.amount/100)).toFixed(2)
            console.log("Calculated Amount is %o", transferAmount)
            var xferObj = await stripe.transfers.create(
              {
                amount: transferAmount*100,
                currency: 'usd',
                destination: data.object.metadata.sellerStripeId,
                transfer_group: ord._id.toString(),
                metadata: data.object.metadata
              }
            );
            const updateMetadata = await stripe.charges.update(
              xferObj.destination_payment,
              {metadata: data.object.metadata},
              {stripeAccount: xferObj.destination}
            );
            console.log('Successfully added metadata')
            
        } else {
                  /**
         * Today, when you create a Destination charge, whether using the Charges API or the PaymentIntents API, 
         * the metadata you set on the platform will not propagate to the connected account's charge. 
         * This is expected behavior as we treat this information as private to the platform. 
         * https://confluence.corp.stripe.com/display/DevHelpKB/How+can+you+carry+over+the+description+or+metadata+to+the+payment+on+the+connected+account+for+a+destination+charge
         */

        
        const chargeObj = await stripe.charges.retrieve(data.object.charges.data[0].id, {
          expand: ['transfer'],
        });
        console.log (' Distination payment id is %o', chargeObj.transfer.destination_payment)
        const updateMetadata = await stripe.charges.update(
          chargeObj.transfer.destination_payment,
          {metadata: data.object.metadata},
          {stripeAccount: chargeObj.transfer.destination}
        );
        console.log('Successfully added metadata')
        }


        })
      } else if (eventType === "payment_intent.payment_failed") {
      console.log("❌ Payment failed.");
    }
    res.sendStatus(200);
  });

  hooksRoutes.post("/connect", async (req, res) => {
    console.log("Received a connect hook");
    let data, eventType;

    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET_CONNECT) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET_CONNECT
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      data = event.data;
      eventType = event.type;
      console.log("Received a hook of Type %o", event.type);
      console.log("Data from hook is %o", data);
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // we can retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }

    if (eventType === "account.updated") {
      console.log('Updating Account')
    }
    res.sendStatus(200);
  });
};
