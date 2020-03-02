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
    logout: async function () {

    }

}

export default apiClient