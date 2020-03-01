const axios = require('axios')

const axiosApi = axios.create({
  baseURL:
    process.env.REACT_APP_BASE_URL !== undefined
      ? process.env.REACT_APP_BASE_URL
      : 'http://localhost:3000/'
})

axiosApi.interceptors.request.use(
  config => {
    const token = window.sessionStorage.getItem('jwt')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  error => {
    console.log('Error in setting header %o', error)
    return Promise.reject(error)
  }
)

export default axiosApi