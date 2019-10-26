<template>
  <div id="app">
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import getUrl from '@/utils/getUrl'
import { sign, login } from '@/api/index'
import { Indicator } from 'mint-ui'
export default {
  name: 'App',
  beforeCreate() {
    let code = getUrl()['code'];
    if (!code && !localStorage.getItem('token')) {
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      let APPID = 'wxb60e3a8b79f4e69a'
      let REDIRECT_URI = encodeURIComponent(window.location.href)
      let state = Math.ceil(Math.random() * 1000)
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_userinfo&state=${state}&connect_redirect=1#wechat_redirect`
      return false
    }
    if (code && !localStorage.getItem('token')) {
      login({
        code: code
      }).then(res => {
        localStorage.setItem('token', res.data)
      })
    }
  },
  created() {
    sign({
      url: (window.location.href.split('#')[0])
    }).then(res => {
      wx.config({
        debug: false,
        appId: res.data.appId,
        timestamp: res.data.timestamp,
        nonceStr: res.data.nonceStr,
        signature: res.data.signature,
        jsApiList: ['checkJsApi', 'chooseWXPay', 'onMenuShareAppMessage', 'onMenuShareTimeline'],
        success: function (res) {
          console.log('config success')
        },
        fail: function (res) {
          console.log('config fail')
        }
      })
    })
  }
}
</script>
<style lang="less">
// 1px border
@import "~vux/src/styles/1px.less";
// css close
@import "~vux/src/styles/close.less";
</style>
