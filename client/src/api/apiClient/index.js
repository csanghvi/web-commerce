import API from "../axiosApi";
import {loadStripe} from '@stripe/stripe-js';
const axios = require("axios");
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);
const token = process.env.REACT_APP_STRIPE_SECRET_KEY;
var querystring = require('querystring');





const apiClient = {
  stripe,
  fetchUserOrders: async function(email){
    return new Promise((resolve, reject) => {
      API.get(`/api/v1/orders?email=${email}`)
        .then(rsp => {
          resolve(rsp.data);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  login: async function(email, password) {
    return new Promise((resolve, reject) => {
      API.post(`/api/login`, { email: email, password: password })
        .then(rsp => {
          resolve(rsp);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  checkLogin: async function() {
    return new Promise((resolve, reject) => {
      API.post(`/api/v1/users/login-status`, {})
        .then(rsp => {
          resolve(rsp);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },

  register: async function(userObj) {
    return new Promise((resolve, reject) => {
      API.post(`/api/register`, { userObj: userObj })
        .then(rsp => {
          resolve(rsp);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  updateAccount: async function(userParams) {
    return new Promise((resolve, reject) => {
      API.post(`/api/v1/users/update-account`, userParams)
        .then(rsp => {
          resolve(rsp);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  createPaymentIntent: async function(params) {
    return new Promise((resolve, reject) => {
      console.log("Sending this data to create intent is %o", params);
      API.post(`/api/v1/payments/create-payment-intent`, params)
        .then(rsp => {
          resolve(rsp);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  createCustomConnect: async function(){
    return new Promise((resolve, reject) => {
      console.log("Requesting back end to create a custom connect account");
      API.post(`/api/v1/users/custom-connect`)
        .then(rsp => {
          resolve(rsp.data.user);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });    
  },
  updateBankAccountDetails: async function(params){
    return new Promise((resolve, reject) => {
      console.log("Sending this data to custom connect is %o");
      API.post(`/api/v1/users/bank-account`, params)
        .then(rsp => {
          resolve(rsp.data);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });    
  },
  createSubscription: async function(params){
    return new Promise((resolve, reject) => {
      console.log("Sending this data to create intent is %o", params);
      API.post(`/api/v1/payments/create-subscription`, params)
        .then(rsp => {
          resolve(rsp.data);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });    
  },
  createCheckoutSession: async function(listingId, amount, quantity, selectedDate) {
    return new Promise((resolve, reject) => {
      console.log("Sending request to create sessoin %o", listingId);
      const data = {
        quantity: quantity,
        amount: amount,
        id: listingId,
        selectedDate: selectedDate
      };
      API.post(`/api/v1/payments/checkout-session`, data)
        .then(rsp => {
          resolve(rsp);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  getCheckoutSession: async function(sessionId) {
    return new Promise((resolve, reject) => {
      API.get(`/api/v1/payments/checkout-session?sessionId=${sessionId}`)
        .then(rsp => {
          resolve(rsp);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  createListing: async function(data) {
    return new Promise((resolve, reject) => {
      API.post(`/api/v1/listing/new`, data)
        .then(rsp => {
          resolve(rsp);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  updateListing: async function(id, data) {
    return new Promise((resolve, reject) => {
      API.post(`/api/v1/listing/edit/${id}`, data)
        .then(rsp => {
          resolve(rsp);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  claimListing: async function(id) {
    return new Promise((resolve, reject) => {
      API.post(`/api/v1/listing/claim/${id}`)
        .then(rsp => {
          resolve(rsp);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  getAllListings: async function(filter) {
    return new Promise((resolve, reject) => {
      API.get(`/api/listings/all?filter=${JSON.stringify(filter)}`)
        .then(rsp => {
          resolve(rsp.data);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  getListing: async function(id) {
    return new Promise((resolve, reject) => {
      API.get(`/api/listings/${id}`)
        .then(rsp => {
          resolve(rsp.data);
          return;
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
          return;
        });
    });
  },
  oAuth: async function(state, code, email) {
    return new Promise((resolve, reject) => {
      // asynchronously called
      console.log("Stripe code id is %o & email is %o", code, email);
      API.post("/api/v1/users/express-connect", { code, email})
        .then(rsp => {
          console.log("Saved account Id %o", rsp);
          resolve(rsp);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });
  },
  createLoginLink: async function(stripeAccountId) {
    return new Promise((resolve, reject) => {
      // asynchronously called
      console.log("Calling stripeAccountID %o", stripeAccountId);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
       };
    
       const bodyParameters = {
        "redirect_url": `${process.env.REACT_APP_BASEURL}/settings`
       };
      axios.post(`https://api.stripe.com/v1/accounts/${stripeAccountId}/login_links`, {}, config)
        .then(rsp => {
          console.log("Returning resonse after making stripe call %o", rsp);
          resolve(rsp);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });
  },
  fetchCustomerPaymentMethods: async function (customerId) {
    //https://api.stripe.com/v1/payment_methods?customer=cus_GuumPFGIpjFPaz&type=card
    return new Promise((resolve, reject) => {
      // asynchronously called
      console.log("Calling stripeAccountID %o", customerId);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
       };
      axios.get(`https://api.stripe.com/v1/payment_methods?customer=${customerId}&type=card`, config)
        .then(rsp => {
          console.log("Returning response after making stripe call %o", rsp);
          resolve(rsp.data.data[0]);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });
  },
  fetchAllCharges: async function (stripeAccountId) {
    return new Promise((resolve, reject) => {
      // asynchronously called
      console.log("Calling stripeAccountID %o", stripeAccountId);
      const config = {
        headers: { Authorization: `Bearer ${token}` , "Stripe-Account": stripeAccountId}
       };
      axios.get(`https://api.stripe.com/v1/charges`, config)
        .then(rsp => {
          console.log("Returning response after making stripe call to fetch charges %o", rsp);
          resolve(rsp.data.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });
  },
  fetchBalanceTransactions: async function(stripeAccountId, payoutId='') {
    return new Promise((resolve, reject) => {
      // asynchronously called
      console.log("Calling stripeAccountID %o", stripeAccountId);
      const config = {
        headers: { Authorization: `Bearer ${token}` , "Stripe-Account": stripeAccountId}
       };
      var url = 'https://api.stripe.com/v1/balance_transactions'
      var queryParam = payoutId ? `?payout=${payoutId}` : ''
      axios.get(`https://api.stripe.com/v1/balance_transactions${queryParam}`, config)
        .then(rsp => {
          console.log("Returning response after making stripe call to fetch charges %o", rsp);
          resolve(rsp.data.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });
  },
  fetchBalanceDetails: async function(stripeAccountId) {
    return new Promise((resolve, reject) => {
      // asynchronously called
      console.log("Calling stripeAccountID %o", stripeAccountId);
      const config = {
        headers: { Authorization: `Bearer ${token}` , "Stripe-Account": stripeAccountId}
       };
      axios.get(`https://api.stripe.com/v1/balance`, config)
        .then(rsp => {
          console.log("Returning response after making stripe call to fetch charges %o", rsp);
          resolve(rsp.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });
  },
  fetchPayoutList: async function(stripeAccountId) {
    return new Promise((resolve, reject) => {
      // asynchronously called
      console.log("Calling stripeAccountID %o", stripeAccountId);
      const config = {
        headers: { Authorization: `Bearer ${token}` , "Stripe-Account": stripeAccountId}
       };
      axios.get(`https://api.stripe.com/v1/payouts?expand[]=data.destination`, config)
        .then(rsp => {
          console.log("Returning response after making stripe call to fetch charges %o", rsp);
          resolve(rsp.data.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });
  },
  fetchAllPlans: async function() {
    return new Promise((resolve, reject) => {
      // asynchronously called
      const config = {
        headers: { Authorization: `Bearer ${token}` }
       };
      axios.get(`https://api.stripe.com/v1/plans`, config)
        .then(rsp => {
          console.log("Returning response after making stripe call to fetch plans %o", rsp);
          resolve(rsp.data.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });
  },
  fetchCurrentSubscriptions: async function(stripeCustomerId) {
    return new Promise((resolve, reject) => {
      // asynchronously called
      const config = {
        headers: { Authorization: `Bearer ${token}` }
       };
      axios.get(`https://api.stripe.com/v1/subscriptions?customer=${stripeCustomerId}&expand[]=data.latest_invoice.payment_intent`, config)
        .then(rsp => {
          console.log("Returning response after making stripe call to fetch subscription %o", rsp.data.data);
          resolve(rsp.data.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });
  },
  cancelSubscription: async function(subId) {
    return new Promise((resolve, reject) => {
      // asynchronously called
      const config = {
        headers: { Authorization: `Bearer ${token}` }
       };
      axios.delete(`https://api.stripe.com/v1/subscriptions/${subId}`, config)
        .then(rsp => {
          console.log("Returning response after canceling subscription %o", rsp.data);
          resolve(rsp.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });
  },
  getCustomAccountLink: async function(stripeAccountId, type = 'custom_account_verification'){
    return new Promise((resolve, reject) => {
      // asynchronously called
      const config = {
        headers: { Authorization: `Bearer ${token}` }
       };
       const bodyParameters = {
        account: stripeAccountId,
        failure_url:`${process.env.REACT_APP_BASEURL}/settings`,
        success_url: `${process.env.REACT_APP_BASEURL}/listings/new`,
        type: type
       };
       console.log("Sending bodyparams as %o", bodyParameters)
      axios.post(`https://api.stripe.com/v1/account_links`, querystring.stringify(bodyParameters), config)
        .then(rsp => {
          console.log("Returning response after canceling subscription %o", rsp.data);
          resolve(rsp.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });    
  },
  getStripeAccountStatus: async function(stripeAccountId){
    return new Promise((resolve, reject) => {
      // asynchronously called
      const config = {
        headers: { Authorization: `Bearer ${token}` }
       };
      axios.get(`https://api.stripe.com/v1/accounts/${stripeAccountId}`, config)
        .then(rsp => {
          console.log("Returning response after fetching account obj %o", rsp.data);
          resolve(rsp.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });    
  },
  createBankAccountToken: async function(params){
    return new Promise(async (resolve, reject) => {
      // asynchronously called
      const stripe = await loadStripe('pk_test_XvODp9OF6PFNt7Yka7dieFYp00MTqbXTDK');

      stripe.createToken('bank_account', {
                          country: 'US',
                          currency: 'usd',
                          routing_number: params.routingNumber,
                          account_number: params.bankAccountNumber,
                          account_holder_name: params.accountHolderName,
                          account_holder_type: params.accountHolderType,
                        })
      .then(res => {
        console.log('Result is %o', res.token)
        resolve(res.token)
      })
      .catch (err => {
        console.log('Error is %o', err)
      })
    });    
  },
  retrievePaymentIntent: async function(paymentIntentId){
    return new Promise((resolve, reject) => {
      // asynchronously called
      const config = {
        headers: { Authorization: `Bearer ${token}` }
       };
      axios.get(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, config)
        .then(rsp => {
          console.log("Returning response after fetching account obj %o", rsp.data);
          resolve(rsp.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });    
  },
  setTransferReversal: async function(tr){
    return new Promise((resolve, reject) => {
      // asynchronously called
      const config = {
        headers: { Authorization: `Bearer ${token}` }
       };

      axios.post(`https://api.stripe.com/v1/transfers/${tr}/reversals`, {}, config)
        .then(rsp => {
          console.log("After creating a transfer reversal %o", rsp.data);
          resolve(rsp.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });    
  },
  sendPayout: async function(amount, stripeAccountId){
    return new Promise((resolve, reject) => {
      // asynchronously called
      const config = {
        headers: { Authorization: `Bearer ${token}` , "Stripe-Account": stripeAccountId}
       };
       const bodyParameters = {
        amount: amount,
        currency:"usd",
       };
      axios.post(`https://api.stripe.com/v1/payouts`, querystring.stringify(bodyParameters), config)
        .then(rsp => {
          console.log("After payout %o", rsp.data);
          resolve(rsp.data);
        })
        .catch(err => {
          console.log("Error received from server is %o", err)
        });
    });    
  }
};

export default apiClient;