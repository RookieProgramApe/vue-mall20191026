<template>
  <div class="myBargaining-container">
    <Header :title="title"></Header>
    <div class="bargainingDetail">
      <div class="detail">
        <div class="icon">
          <img :src="detail.cargo.picture" />
        </div>
        <div class="info">
          <div class="name am-line-2">{{detail.cargo.name}}</div>
          <div class="sale">已售{{detail.cargo.saleNum}}件</div>
          <div class="price">
            <span>最低￥{{detail.floorPrice}}</span>
            <span>￥{{detail.cargo.originalPrice}}</span>
          </div>
        </div>
      </div>
      <div class="num">已砍{{detail.ykCount}}次，还需完成{{detail.wkCount}}次砍价即可购买商品</div>
      <div class="barPrice">
        <div class="box">
          <div class="title">当前成交价格</div>
          <div class="price">￥{{detail.endPrice}}</div>
          <div class="orign">原价￥{{detail.originalPrice}}</div>
        </div>
        <div class="box">
          <div class="title">已砍金额</div>
          <div class="price">￥{{detail.ykPrice}}</div>
          <div class="orign">砍价次数{{detail.ykCount}}次</div>
        </div>
      </div>
      <div class="btn" v-if="detail.status!=3">
        <button
          :class="{buy:detail.status=='2'}"
          @click="buy"
        >{{detail.status=='2'?'立即购买':'喊好友砍一刀'}}</button>
      </div>
    </div>
    <div class="nav">
      <tab
        :line-width="2"
        custom-bar-width="5rem"
        active-color="#0085FE"
        default-color="#262626"
        bar-active-color="#0085FE"
      >
        <tab-item selected @on-item-click="setTab('1')">砍价榜</tab-item>
        <tab-item @on-item-click="setTab('2')">商品详情</tab-item>
        <tab-item @on-item-click="setTab('3')">砍价说明</tab-item>
      </tab>
      <div class="bargainList" v-if="tabIndex==1">
        <div class="item" v-for="(item,index) in barggain" :key="index">
          <div class="avatar">
            <img :src="item.avatar" alt />
          </div>
          <div class="name">{{item.nickname}}</div>
          <div class="desc">
            <span>小刀一挥帮忙砍了</span>
            <span class="price">{{item.price}}元</span>
          </div>
        </div>
        <div v-if="!barggain.length" class="empty">
          <img src="@/assets/image/enpty_01.png" />
          <span>暂无砍价记录，快去邀请你的好友砍价哦</span>
        </div>
      </div>
      <div v-if="tabIndex==2" class="goods-detail">
        <div class="contents" v-html="detail.cargo.description"></div>
      </div>
      <div v-if="tabIndex==3" class="goods-detail">
        <div class="contents" v-html="detail.cnts"></div>
      </div>
    </div>
    <div>
      <img
        v-show="scrollTop&&!inviteModelStatus"
        class="back_to_top"
        src="@/assets/image/back_to_top.png"
        @click="scrollToY(0, 1500, 'easeInOutQuint')"
      />
    </div>
    <div class="mask" v-if="inviteModelStatus">
      <div class="modelBox">
        <img src="@/assets/image/invite.png" alt />
        <button @click="closeInviteModel">我知道了</button>
      </div>
    </div>
    <div class="mask mask1 animater fadeIn" v-if="showStatus"></div>
    <div class="model animater fadeInUp" v-if="showStatus">
      <div class="detail">
        <div class="icon">
          <img :src="detail.cargo.picture" />
        </div>
        <div>
          <p class="prices">
            <span style="color:#E64340;font-size:0.88rem;">¥</span>
            <span style="color:#E64340;font-size:1.13rem;">{{detail.endPrice}}</span>
          </p>
          <p class="sale">库存{{inventory}}件</p>
        </div>
        <div class="close" @click="closeModel">
          <img src="@/assets/image/close.png" />
        </div>
      </div>
      <div class="title">种类</div>
      <div class="sku">
        <div
          v-for="(item,index) in detail.cargo.sku"
          :key="index"
          :class="item.id==skuId?'active':''"
          @click="chooseSku(item.id,item.inventory)"
        >{{item.name}}</div>
      </div>
      <div class="num">
        <label>购买数量</label>
        <span>1件</span>
      </div>
      <div class="btns">
        <button @click="pay">立即购买</button>
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { Indicator, Toast } from 'mint-ui'
import { Tab, TabItem } from 'vux'
import Header from '@/components/Header'
import { orderDetail, BargainingList, sign } from '@/api/index'
export default {
  name: 'myBargaining',
  components: { Header, Tab, TabItem },
  data() {
    return {
      title: '我的砍价',
      tabIndex: 1,
      id: '',
      detail: {
        cargo: {}
      },
      scrollTop: false,
      barggain: [],
      inviteModelStatus: false,
      inventory: '',
      skuId: '',
      showStatus: false
    }
  },
  computed: {
    showTop: function () {
      return this.scrollTop > 1500
    }
  },
  created() {
    this.id = this.$route.query.id
    this.orderDetail()
    this.BargainingList()
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
  },
  mounted() {
    document.title = '我的砍价'
    window.addEventListener('scroll', this.getScrollTop)
  },
  methods: {
    setTab(tabIndex) {
      this.tabIndex = tabIndex
    },
    orderDetail() {
      let vm = this
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      orderDetail({
        orderId: vm.id
      }).then(res => {
        Indicator.close()
        vm.detail = res.data
        vm.share();
        this.skuId = this.detail.cargo.sku[0].id
        this.inventory = this.detail.cargo.sku[0].inventory
      })
    },
    scrollToY(scrollTargetY, speed, easing) {
      let scrollY = window.scrollY || document.documentElement.scrollTop
      scrollTargetY = scrollTargetY || 0
      speed = speed || 2000
      easing = easing || 'easeOutSine'
      let currentTime = 0
      let time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8))
      let easingEquations = {
        easeOutSine: function (pos) {
          return Math.sin(pos * (Math.PI / 2))
        },
        easeInOutSine: function (pos) {
          return (-0.5 * (Math.cos(Math.PI * pos) - 1))
        },
        easeInOutQuint: function (pos) {
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 5)
          }
          return 0.5 * (Math.pow((pos - 2), 5) + 2)
        }
      }
      function tick() {
        currentTime += 1 / 60
        let p = currentTime / time
        let t = easingEquations[easing](p)
        if (p < 1) {
          window.requestAnimFrame(tick)
          window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t))
        } else {
          window.scrollTo(0, scrollTargetY)
        }
      }
      tick()
    },
    getScrollTop() {
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    },
    BargainingList() {
      let vm = this
      BargainingList({
        orderId: vm.id
      }).then(res => {
        vm.barggain = res.data
      })
    },
    buy() {
      let vm = this
      if (vm.detail.status !== 2) {
        vm.inviteModelStatus = true
        return false
      }
      if (vm.detail.status === 2) {
        vm.showStatus = true
      }
    },
    closeInviteModel() {
      this.inviteModelStatus = false
    },
    closeModel() {
      this.showStatus = false
    },
    chooseSku(id, inventory) {
      this.skuId = id;
      this.inventory = inventory
    },
    pay() {
      let vm = this;
      if (vm.inventory < 1) {
        Toast({
          message: '该规格商品库存不足，请选择其他规格',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      vm.$router.push({
        path: '/pay',
        query: {
          orderId: vm.id,
          skuId: vm.skuId
        }
      })
    },
    share() {
      let vm = this
      wx.ready(function () {
        wx.onMenuShareTimeline({
          title: vm.detail.shareContent,
          link: `https://aw.wisehuitong.com/shareInter?id=${vm.id}`,
          imgUrl: vm.detail.sharePic,
          success: function () {
            vm.inviteModelStatus = false
            console.log('111')
          },
          cancel: function () {
            console.log('222')
          }
        })
        wx.onMenuShareAppMessage({
          title: vm.detail.shareContent,
          desc: '',
          link: `https://aw.wisehuitong.com/shareInter?id=${vm.id}`,
          imgUrl: vm.detail.sharePic,
          type: '',
          dataUrl: '',
          success: function () {
            vm.inviteModelStatus = false
            console.log('333')
          },
          cancel: function () {
            console.log('444')
          }
        })
      })
    }
  }
}
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
  }
})()
</script>

<style lang="less">
.myBargaining-container {
  background: #f7f7f7;
  min-height: 100vh;
  padding: 0.75rem 0.94rem;
  box-sizing: border-box;
  .bargainingDetail {
    background: #fff;
    border-radius: 0.31rem;
    .detail {
      border-bottom: 0.03rem solid #eeeeee;
      padding: 0.94rem 0.63rem 0.63rem 0.63rem;
      display: flex;
      align-items: flex-start;
      .icon img {
        width: 5.31rem;
        height: 5.31rem;
      }
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 0.84rem;
        .name {
          font-size: 0.81rem;
          color: #333333;
        }
        .sale {
          font-size: 0.69rem;
          color: #888888;
          margin-top: 0.25rem;
          margin-bottom: 0.39rem;
        }
        .price {
          font-size: 0.88rem;
          color: #e64340;
          span:nth-of-type(2) {
            font-size: 0.75rem;
            color: #a9a9a9;
            text-decoration: line-through;
          }
        }
      }
    }
    .num {
      margin: 0.75rem 0.63rem;
      background: #eeeeee;
      height: 2.06rem;
      line-height: 2.06rem;
      text-align: center;
      font-size: 0.75rem;
      color: #333333;
    }
    .barPrice {
      display: flex;
      justify-content: space-between;
      margin: 1.41rem 1.94rem 0.94rem 1.94rem;
      .box {
        border: 0.03rem solid #a9a9a9;
        width: 7.81rem;
        height: 4.38rem;
        position: relative;
        text-align: center;
        .title {
          background: #eeeeee;
          font-size: 0.69rem;
          color: #e64340;
          text-align: center;
          height: 1.32rem;
          line-height: 1.32rem;
          width: 5.32rem;
          position: absolute;
          top: -0.66rem;
          left: 50%;
          margin-left: -2.62rem;
        }
        .price {
          font-size: 1.13rem;
          color: #e64340;
          margin-top: 1.06rem;
        }
        .orign {
          font-size: 0.75rem;
          color: #888888;
        }
      }
    }
    .btn {
      margin: 0 0.63rem;
      padding-bottom: 0.94rem;
      button {
        background: linear-gradient(to right, #0089fe, #0066fe);
        height: 2.44rem;
        line-height: 2.44rem;
        color: #fff;
        font-size: 1.06rem;
        border: none;
        width: 100%;
        border-radius: 0.31rem;
      }
      .buy {
        background: #e64340;
      }
    }
  }
  .nav {
    margin: 0.69rem 0 0.94rem 0rem;
    background: #fff;
    border-radius: 0.31rem;
    .bargainList {
      min-height: 5rem;
      .item {
        display: flex;
        align-items: center;
        padding: 0.75rem 1.25rem;
        font-size: 0.75rem;
        .avatar {
          img {
            width: 1.56rem;
            height: 1.56rem;
            border-radius: 50%;
          }
        }
        .name {
          color: #333333;
          margin-left: 0.53rem;
        }
        .desc {
          flex: 1;
          font-size: 0.75rem;
          color: #333333;
          margin-left: 1.31rem;
          .price {
            color: #e64340;
          }
        }
      }
      .empty {
        position: relative;
        margin-top: 4.72rem;
        bottom: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        font-size: 0.75rem;
        color: #999;
        justify-content: center;
        align-items: center;
        padding-bottom: 2rem;
        img {
          width: 10.5rem;
          height: 7.5rem;
          margin-bottom: 1rem;
          margin-top: -3.36rem;
        }
      }
    }
  }
  .goods-detail {
    background: #fff;
    margin-top: 0.78rem;
    padding-bottom: 3.03rem;
    .contents {
      font-size: 0.81rem;
      color: #000000;
      img {
        width: 100% !important;
      }
      p {
        padding: 0 0.94rem !important;
      }
    }
  }
  .mask {
    background: rgba(0, 0, 0, 1);
    position: fixed;
    top: 3rem;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 888;
    z-index: 999;
    padding: 1.38rem 1.56rem;
    .modelBox {
      position: relative;
      height: 21.88rem;
      img {
        width: 100%;
        height: 21.88rem;
        position: absolute;
        top: 0;
        left: 0;
      }
      button {
        position: absolute;
        bottom: 1rem;
        height: 3.5rem;
        width: 11rem;
        left: 50%;
        margin-left: -5.5rem;
        opacity: 0;
      }
    }
  }
  .mask1 {
    background: rgba(0, 0, 0, 0.5);
  }
  .model {
    position: fixed;
    background: #fff;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    width: 100%;
    padding: 0.75rem 0.94rem 0.31rem 0.75rem;
    .detail {
      display: flex;
      align-items: center;
      border-bottom: 0.03rem solid #eee;
      padding: 0.87rem 0;
      div:nth-of-type(2) {
        flex: 1;
      }
      .icon img {
        width: 4.38rem;
        height: 4.38rem;
        margin-right: 0.59rem;
      }
      p {
        margin: 0;
        font-size: 0.75rem;
        color: #888888;
      }
      .close {
        margin-top: -5.8rem;
        margin-right: -1rem;
        img {
          width: 2rem;
          height: 2rem;
        }
      }
    }
    .title {
      height: 2.31rem;
      display: flex;
      align-items: center;
      font-size: 0.88rem;
      color: #000000;
    }
    .sku {
      display: flex;
      flex-wrap: wrap;
      font-size: 0.75rem;
      color: #000000;
      border-bottom: 0.03rem solid #eee;
      div {
        background: #eeeeee;
        padding: 0.59rem 0.97rem;
        border-radius: 0.38rem;
        margin-bottom: 0.63rem;
        margin-left: 2rem;
      }
      div:nth-of-type(1) {
        margin-left: 0;
      }
      div.active {
        background: transparent;
        border: 0.04rem solid #f95a4b;
      }
    }
    .num {
      display: flex;
      align-items: center;
      height: 2.6rem;
      font-size: 0.75rem;
      color: #888888;
      border-bottom: 0.03rem solid #eee;
      label {
        margin-right: 2rem;
        font-size: 0.88rem;
        color: #000000;
      }
    }
    .btns {
      border-top: none;
      button {
        height: 2.5rem;
        background: linear-gradient(to right, #0095fe, #0066fe);
        border-radius: 1.25rem;
        line-height: 2.5rem;
        font-size: 1.13rem;
        color: #fff;
        border: none;
        outline: none;
        margin: 0.31rem 0 0 0;
        width: 100%;
      }
    }
  }
}
.back_to_top {
  position: fixed;
  z-index: 9999;
  bottom: 3.5rem;
  right: 0.26rem;
  width: 2.5rem;
  height: 2.5rem;
  overflow: hidden;
  border-radius: 0.3rem;
}
</style>
