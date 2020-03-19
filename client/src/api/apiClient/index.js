import API from "../axiosApi";
const axios = require("axios");
const stripe = require("stripe")("sk_test_wcPqI47agQt8hXOnZRAqeeen00tGgkDtny");
const token = "sk_test_wcPqI47agQt8hXOnZRAqeeen00tGgkDtny";

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
      API.post("/api/v1/users/connect", { code, email})
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
        "redirect_url": "http://localhost:3000/settings"
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
          resolve(rsp.data.data[0].card);
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
  fetchBalanceTransactions: async function(stripeAccountId) {
    return new Promise((resolve, reject) => {
      // asynchronously called
      console.log("Calling stripeAccountID %o", stripeAccountId);
      const config = {
        headers: { Authorization: `Bearer ${token}` , "Stripe-Account": stripeAccountId}
       };
      axios.get(`https://api.stripe.com/v1/balance_transactions`, config)
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
  }
};

export default apiClient;