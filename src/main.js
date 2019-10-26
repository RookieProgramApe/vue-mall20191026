import Vue from 'vue'

import App from './App'

import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
// animate css
import 'vue2-animate/dist/vue2-animate.min.css'
// vue-router
import router from './router'

// 自定义数据
import './mock'

// wxjssdk
import { WechatPlugin } from 'vux'

import './utils/rem'

// amazeui.min.css
import '@/styles/nomalize.css'
import VueImageSwipe from 'vue-image-swipe'
import 'vue-image-swipe/dist/vue-image-swipe.css'
// 移出点击延迟
const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.use(WechatPlugin)

// mint-ui
Vue.use(Mint)

Vue.use(VueImageSwipe)
Vue.config.productionTip = false
/* eslint-disable no-new */
Vue.directive('resetPage', {
  inserted: function (el) {
    document.body.addEventListener('focusout', () => {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
          window.scrollTo(0, Math.max(scrollHeight - 1, 0))
        }, 100)
      }
    })
  }
})
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
