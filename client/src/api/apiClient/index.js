import API from "../axiosApi";
const axios = require("axios");
const stripe = require("stripe")("sk_test_wcPqI47agQt8hXOnZRAqeeen00tGgkDtny");
const token = "sk_test_wcPqI47agQt8hXOnZRAqeeen00tGgkDtny";

const apiClient = {
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
  createCheckoutSession: async function(listingId, amount, quantity) {
    return new Promise((resolve, reject) => {
      console.log("Sending request to create sessoin %o", listingId);
      const data = {
        quantity: quantity,
        amount: amount,
        id: listingId
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
      API.get(`/api/v1/listing/all?filter=${JSON.stringify(filter)}`)
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
      API.get(`/api/v1/listing/${id}`)
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
  }
};

export default apiClient;