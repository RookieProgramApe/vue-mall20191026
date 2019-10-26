<template>
  <div class="detail-container">
    <Header :title="title"></Header>
    <div class="show">
      <div class="show-main" v-show="type=='video'">
        <video
          ref="video"
          controls
          id="video"
          width="100%"
          preload="auto"
          :poster="goodsInfo.cargo.picture"
          style="object-fit:fill;display:block;"
          :src="goodsInfo.cargo.mov"
        ></video>
        <div class="play" v-if="playShowStatus" @click="play">
          <img src="@/assets/image/plays.png" alt />
        </div>
      </div>
      <div class="image" v-show="type=='image'">
        <img class="swiper" :src="goodsInfo.cargo.picture" />
      </div>
      <div class="type">
        <div
          v-if="goodsInfo.cargo.mov"
          :class="type=='video'?'active':''"
          @click="chooseType('video')"
        >
          <img src="@/assets/image/play.png" />
          <span>视频</span>
        </div>
        <div :class="type=='image'?'active':''" @click="chooseType('image')">图片</div>
      </div>
    </div>
    <div class="detail">
      <div class="price">
        <div>
          <span>最低¥{{goodsInfo.floorPrice}}</span>
          <span
            style="text-decoration: line-through;font-size: 0.75rem;color:#A9A9A9"
          >￥{{goodsInfo.originalPrice}}</span>
        </div>
        <div class="sale">剩余{{goodsInfo.kz}}次机会</div>
      </div>
      <div class="name">{{goodsInfo.cargo.name}}</div>
    </div>
    <div class="goods-detail">
      <div class="title">砍价说明</div>
      <div class="contents">
        <div v-html="goodsInfo.cnts"></div>
      </div>
    </div>
    <div class="goods-detail">
      <div class="title">商品详情</div>
      <div class="contents">
        <div v-html="goodsInfo.cargo.description"></div>
      </div>
    </div>
    <div class="btn">
      <button @click="barGain">发起砍价</button>
    </div>
    <div>
      <img
        v-show="scrollTop"
        class="back_to_top"
        src="@/assets/image/back_to_top.png"
        @click="scrollToY(0, 1500, 'easeInOutQuint')"
      />
    </div>
  </div>
</template>

<script>
import { Indicator, MessageBox } from 'mint-ui'
import Header from '@/components/Header'
import { bargainDetail, addBargain } from '@/api/index'
import { Swiper } from 'vux'
export default {
  name: 'detail',
  components: { Header, Swiper },
  data() {
    return {
      title: '商品详情',
      id: '',
      goodsInfo: {
        cargo: {}
      },
      banner_index: 0,
      playShowStatus: true,
      type: 'video',
      scrollTop: false
    }
  },
  computed: {
    showTop: function () {
      return this.scrollTop > 700
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getDetail()
  },
  mounted() {
    document.title = '商品详情'
    this.isPlay()
    window.addEventListener('scroll', this.getScrollTop)
  },
  methods: {
    getDetail() {
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      bargainDetail({
        id: this.id
      }).then(res => {
        Indicator.close()
        this.goodsInfo = res.data
        if (this.goodsInfo.cargo.mov) {
          this.type = 'video'
        } else {
          this.type = 'image'
        }
      })
    },
    play() {
      this.$refs.video.play()
    },
    isPlay() {
      let vm = this;
      let myVideo = vm.$refs.video;
      myVideo.addEventListener('play', function () {
        vm.playShowStatus = false
      });
      myVideo.addEventListener('pause', function () {
        vm.playShowStatus = true
      })
    },
    chooseType(type) {
      this.type = type;
      this.$refs.video.pause()
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
    barGain() {
      let vm = this
      if (vm.goodsInfo.kz <= 0) {
        MessageBox({
          title: '提示',
          message: '很遗憾，发起砍价的机会已用完',
          confirmButtonText: '确定',
          showCancelButton: false
        })
        return false
      }
      MessageBox({
        title: '温馨提示',
        message: '您要发起砍价吗?',
        confirmButtonText: '确定',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          Indicator.open({
            text: 'Loading...',
            spinnerType: 'fading-circle'
          })
          addBargain({
            id: vm.goodsInfo.id
          }).then(res => {
            Indicator.close()
            if (res.code === 200) {
              let id = res.data
              vm.$router.push({
                path: '/myBargaining',
                query: {
                  id: id
                }
              })
            }
          })
        }
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
.detail-container {
  min-height: 100vh;
  background: #f7f7f7;
  .btn {
    position: fixed;
    bottom: 0;
    height: 3.06rem;
    left: 0;
    right: 0;
    background: #ffffff;
    display: flex;
    align-items: center;
    z-index: 99;
    padding: 0 1rem;
    border-top: 0.03rem solid #e5e5e5;
    .kefu {
      font-size: 0.63rem;
      color: #333333;
      width: 2.5rem;
      img {
        width: 1.38rem;
        height: 1.38rem;
      }
    }
    button {
      background: linear-gradient(to right, #0095fe, #0066fe);
      height: 2.5rem;
      border-radius: 1.25rem;
      width: 100%;
      border: none;
      outline: none;
      font-size: 1.13rem;
      color: #fff;
    }
  }
  .show {
    position: relative;
    height: 21.88rem;
    background: #ffffff;
    .show-main {
      position: relative;
      video {
        height: 21.88rem;
        z-index: 99;
      }
      .play {
        position: absolute;
        width: 4.38rem;
        height: 4.38rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 0.06rem solid #888888;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 200;
        margin-left: -2.19rem;
        margin-top: -4.19rem;
        img {
          width: 2.2rem;
          height: 2.2rem;
        }
      }
    }
    .swiper {
      width: 100%;
      height: 21.88rem;
    }
    .type {
      width: 100%;
      position: absolute;
      z-index: 201;
      bottom: 2.69rem;
      display: flex;
      align-items: cenetr;
      justify-content: center;
      div {
        background: #dfdfdf;
        border-radius: 0.66rem;
        width: 2.94rem;
        height: 1.31rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 0.31rem;
        font-size: 0.63rem;
        color: #888888;
        img {
          width: 0.75rem;
          height: 0.75rem;
        }
      }
      .active {
        background: #0066fe;
        color: #ffffff;
      }
    }
  }
  .detail {
    background: #fff;
    display: block;
    padding: 0.87rem 0.91rem;
    .price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.94rem;
      color: #e64340;
      .sale {
        font-size: 0.81rem;
        color: #a9a9a9;
      }
    }
    .name {
      font-size: 0.88rem;
      color: #000000;
      margin-top: 0.84rem;
      text-align: justify;
    }
  }
  .goods-detail {
    background: #fff;
    margin-top: 0.78rem;
    padding-bottom: 3.03rem;
    .title {
      height: 2.72rem;
      padding-left: 0.94rem;
      font-size: 0.94rem;
      color: #000000;
      line-height: 2.72rem;
      border-bottom: 0.03rem solid #e5e5e5;
    }
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
  z-index: 99;
  bottom: 3.5rem;
  right: 0.26rem;
  width: 2.5rem;
  height: 2.5rem;
  overflow: hidden;
  border-radius: 0.3rem;
}
.mint-msgbox-btns button {
  box-sizing: border-box;
  width: auto !important;
  padding: 0 !important;
}
.mint-msgbox-cancel {
  border-right: 0.03rem solid #ddd !important;
}
.mint-msgbox-btn {
  border: 0.01rem solid #ddd !important;
  border-top: none !important;
  border-bottom: none !important;
}
</style>
