import axios from 'axios'
const BASEURL = 'http://localhost:8080'

const axiosClient = axios.create({
  baseURL: BASEURL,
  headers: {}
})

axiosClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (user) {
    config.headers.Authorization = `Bearer ${user.jwt}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    throw error
  }
)

export default axiosClient
