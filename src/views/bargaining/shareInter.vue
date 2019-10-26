<template>
  <div class="shareInter-container">
    <div class="header">
      <img src="@/assets/image/index.png" class="index" @click="home" />
      <div>{{title}}</div>
    </div>
    <div style="height:3rem;"></div>
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
      <div class="prompt">
        <div class="avatar">
          <img :src="detail.memberAvatar" />
        </div>
        <div class="desc">
          <div
            class="text"
          >已经有{{detail.ykCount}}个人帮我砍价了，离目标还需要再砍{{detail.wkCount}}次，当前价格为{{detail.endPrice}}元，你也帮我砍一刀吧！</div>
          <img src="@/assets/image/bg.png" />
        </div>
      </div>
      <div class="width" v-if="detail.isHelp">您已成功帮TA砍了{{detail.heplePrice}}元</div>
      <div :class="{btn:true, btns:withStatus}">
        <button class="buy" @click="goList">我也要参与</button>
        <button v-if="!detail.isHelp" @click="bargin">帮TA砍一刀</button>
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
  </div>
</template>

<script>
import { Indicator, MessageBox } from 'mint-ui'
import { Tab, TabItem } from 'vux'
import Header from '@/components/Header'
import { orderDetail, BargainingList, cut } from '@/api/index'
export default {
  name: 'shareInter',
  components: { Header, Tab, TabItem },
  data() {
    return {
      title: '帮TA砍价',
      tabIndex: 1,
      withStatus: true,
      id: '',
      detail: {
        cargo: {}
      },
      scrollTop: false,
      barggain: [],
      inviteModelStatus: false
    }
  },
  computed: {
    showTop: function () {
      return this.scrollTop > 1000
    }
  },
  created() {
    this.id = this.$route.query.id
    this.orderDetail()
    this.BargainingList()
  },
  mounted() {
    document.title = '帮TA砍价'
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
    goList() {
      this.$router.push({
        path: '/bargaining'
      })
    },
    bargin() {
      let vm = this
      cut({
        orderId: vm.id
      }).then(res => {
        if (res.code === 200) {
          MessageBox({
            title: '砍价成功',
            message: `您成功帮TA砍了${res.data}元`,
            confirmButtonText: '确定',
            showCancelButton: false
          })
          vm.detail.isHelp = true
          orderDetail({
            orderId: vm.id
          }).then(res1 => {
            vm.detail = res1.data
          })
          vm.BargainingList()
        } else {
          MessageBox({
            title: '砍价失败',
            message: '您已经帮TA砍过一次了',
            confirmButtonText: '确定',
            showCancelButton: false
          })
        }
      })
    },
    home() {
      this.$router.push({
        path: '/index'
      })
    }
  }
}
</script>

<style lang="less">
.shareInter-container {
  background: #f7f7f7;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 0.75rem 0.94rem;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3rem;
    background: linear-gradient(to right, #0095fe 60%, #0066fe);
    padding: 0 1.5rem;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: #fff;
    .index {
      position: absolute;
      left: 1rem;
      width: 1.8rem;
      height: 1.8rem;
    }
  }
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
    .btn {
      margin: 0 0.63rem;
      padding-bottom: 0.94rem;
      display: flex;
      margin-top: 1.09rem;
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
        margin-right: 0.94rem;
      }
    }
    .btns {
      justify-content: center;
      button {
        width: 9.69rem;
        height: 2.44rem;
        line-height: 2.4rem;
      }
    }
    .prompt {
      display: flex;
      align-items: center;
      margin-top: 0.69rem;
      font-size: 0.75rem;
      color: #333333;
      padding: 0 0.63rem;
      .desc {
        flex: 1;
        position: relative;
        height: 2.94rem;

        img {
          position: absolute;
          top: 0;
          width: auto;
          height: 2.94rem;
          z-index: 99;
        }
        .text {
          z-index: 999;
          padding: 0.3rem 0.75rem 0 1.19rem;
          position: absolute;
          top: 0;
          left: 0;
          height: 2.94rem;
          box-sizing: border-box;
        }
      }
      .avatar {
        img {
          width: 1.56rem;
          height: 1.56rem;
          border-radius: 50%;
        }
      }
    }
  }
  .width {
    font-size: 1.06rem;
    color: #333333;
    margin-top: 1.03rem;
    text-align: center;
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
