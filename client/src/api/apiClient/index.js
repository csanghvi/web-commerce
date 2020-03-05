import API from '../axiosApi'
console.log('API is %o', API)

const apiClient = {
    login: async function (email, password) {
      
        return new Promise((resolve, reject) => {
          API
            .post(`/api/login`, {'email':email, 'password':password})
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

    register: async function (userObj) {

        return new Promise((resolve, reject) => {
            API
              .post(`/api/register`, {"userObj":userObj})
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
    createPaymentIntent: async function (listingId, listingQty, listingCurrency) {

        return new Promise((resolve, reject) => {
            API
              .post(`/api/v1/payments/create-payment-intent`, {
                "listingId":listingId, "listingQty":listingQty,listingCurrency 
              })
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
    createCheckoutSession: async function (listingId, amount, quantity) {
      return new Promise((resolve, reject) => {
        console.log('Sending request to create sessoin %o', listingId)
        const data = {
          quantity:quantity,
          amount: amount,
          id:listingId
        }
        API
          .post(`/api/v1/payments/checkout-session`, data)
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
    getCheckoutSession: async function (sessionId) {
      return new Promise((resolve, reject) => {
        API
          .get(`/api/v1/payments/checkout-session?sessionId=${sessionId}`)
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
    }

}

export default apiClient