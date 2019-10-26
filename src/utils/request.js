import axios from 'axios'
import {
  Toast
} from 'mint-ui'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 2000
})

// request interceptor
service.interceptors.request.use(config => {
  config.headers['token'] = localStorage.getItem('token') ? localStorage.getItem('token') : ''
  return config
}, error => {
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 200) {
      Toast({
        message: res.msg,
        position: 'middle',
        duration: 2000
      })
      if (res.code === 403) {
        localStorage.removeItem('token');
        let APPID = 'wxb60e3a8b79f4e69a'
        let REDIRECT_URI = encodeURIComponent(window.location.href)
        let state = Math.ceil(Math.random() * 1000)
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_userinfo&state=${state}&connect_redirect=1#wechat_redirect`
        return false
      }
    } else {
      return response.data;
    }
  },
  error => {
    Toast({
      message: error.message,
      position: 'middle',
      duration: 2000
    })
    return Promise.reject(error)
  })

export default service
