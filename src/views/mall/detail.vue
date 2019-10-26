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
          :poster="goodsInfo.picture"
          style="object-fit:fill;display:block;"
          :src="goodsInfo.mov"
        >
          <source />
        </video>
        <div class="play" v-if="playShowStatus" @click="play">
          <img src="@/assets/image/plays.png" alt />
        </div>
      </div>
      <div class="image" v-show="type=='image'">
        <img class="swiper" :src="goodsInfo.picture" />
      </div>
      <div class="type">
        <div v-if="goodsInfo.mov" :class="type=='video'?'active':''" @click="chooseType('video')">
          <img src="@/assets/image/play.png" />
          <span>视频</span>
        </div>
        <div :class="type=='image'?'active':''" @click="chooseType('image')">图片</div>
      </div>
    </div>
    <div class="detail">
      <div class="price">
        <div>
          <span>¥{{goodsInfo.salePrice}}</span>
          <span
            style="text-decoration: line-through;font-size: 0.75rem;color:#A9A9A9"
          >￥{{goodsInfo.originalPrice}}</span>
        </div>
        <div class="sale">已售{{goodsInfo.saleNum}}件</div>
      </div>
      <div class="name">{{goodsInfo.name}}</div>
    </div>
    <!-- 评价由此开始 -->
    <div class="goods-detail" style="padding-bottom: 1rem;">
      <div class="title"> <span class="line">|</span> 热门评价 </div>
      <div class="contents1">
        <div v-if="appraiseList.length == 0" style="text-align: center; padding: 0.5rem;">
          还没有人评价哦！
        </div>
        <div v-for="(item, index) in appraiseList" :key="index" style="padding: 0.5rem; margin-top: 1rem;"  @click="seeAppraiseDetail(item.id)">
          <img style="width:2.6rem; float: left;" :src="item.memberAvatar" />
          <div style="float: left; padding-left: 0.5rem;">
            <div>{{item.memberName}}</div>
            <div>
              <span v-for="count in item.star" :key="count">
                <img width="15rem" src="@/assets/image/star01.png"/>
              </span>
              <span v-for="count in 5-item.star" :key="count">
                <img width="15rem" src="@/assets/image/star02.png"/>
              </span>
              <!-- <span v-for="(item, index) in star" :key="index">
                <span v-show="item.checked">  <img width="15rem" src="@/assets/image/star01.png"/> </span>
                <span v-show="!item.checked"> <img width="15rem" src="@/assets/image/star02.png"/> </span>
              </span> -->
            </div>
          </div><br><br>
          <div style="margin-top: 0.5rem; font-size: 1rem;">
            {{item.remark}}
          </div>
          <div style="margin-top: 0.5rem;">
            <span style="color: #606266;" v-show="item.skuName">{{item.skuName}}</span>
            <span style="color: #606266;" v-show="item.skuName && item.cateName"> | </span>
            <span style="color: #606266;" v-show="item.cateName">{{item.cateName}}</span>
            <span style="color: #606266;" v-show="!item.skuName && !item.cateName">暂无规格</span>
            <span style="color: #909399; float: right;">{{item.createTime}}</span>
          </div>
          <div style="height: 0.1rem; background: #F2F6FC; margin-top: 0.5rem;"></div>
        </div>
        <div v-if="appraiseList.length != 0"  style="text-align: center; padding-top: 0.5rem;">
          <span style="padding: 0.3rem; color: #606266; border: 0.08rem solid #606266; border-radius: 1.15rem;" @click="seeAll">查看全部评价</span>
        </div>
      </div>
    </div>
    <!-- 评价由此结束 -->
    <div class="goods-detail">
      <div class="title"> <span class="line">|</span> 商品详情</div>
      <div class="contents">
        <div v-html="goodsInfo.description"></div>
      </div>
    </div>
    <div class="btn">
      <div class="kefu" @click="call">
        <img src="@/assets/image/phones.png" />
        <div>客服</div>
      </div>
      <button @click="openModel">立即购买</button>
    </div>
    <div class="mask animater fadeIn" v-if="showStatus"></div>
    <div class="model animater fadeInUp" v-if="showStatus">
      <div class="detail">
        <div class="icon">
          <img :src="goodsInfo.picture" />
        </div>
        <div>
          <p class="prices">
            <span style="color:#E64340;font-size:0.88rem;">¥</span>
            <span style="color:#E64340;font-size:1.13rem;">{{goodsInfo.salePrice}}</span>
          </p>
          <p class="sale">库存{{inventory}}件</p>
        </div>
        <div class="close" @click="closeModel">
          <img src="@/assets/image/close.png" />
        </div>
      </div>
      <div class="title">规格</div>
      <div class="sku">
        <div style="margin-left: 0rem; margin-left: 5px;"
          v-for="(item,index) in goodsInfo.sku"
          :key="index"
          :class="item.id==skuId?'active':''"
          @click="chooseSku(item.id,item.inventory)"
        >{{item.name}}</div>
      </div>
      <div class="title" v-if="goodsInfo.categoryList.length>0">套餐</div>
      <div class="sku">
        <div style="margin-left: 0rem; margin-left: 5px;"
          v-for="(item,index) in goodsInfo.categoryList"
          :key="index"
          :class="item.id==cateId?'active':''"
          @click="chooseCategory(item)"
        >{{item.name}}</div>
      </div>
      <div class="num">
        <label>购买数量</label>
        <span>1件</span>
      </div>
      <div class="btns">
        <button @click="buy">立即购买</button>
      </div>
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
import { MessageBox, Toast, Indicator } from 'mint-ui'
import Header from '@/components/Header'
import { detail, queryTopAppraiseByCargo } from '@/api/index'
import { Swiper } from 'vux'
export default {
  name: 'detail',
  components: { Header, Swiper },
  data() {
    return {
      title: '商品详情',
      id: '',
      goodsInfo: '',
      banner_index: 0,
      playShowStatus: true,
      type: 'video',
      banner_list: [
        {
          url: '',
          img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg'
        },
        {
          url: '',
          img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg'
        }
      ],
      showStatus: false,
      skuId: '',
      cateId: '',
      inventory: '',
      scrollTop: false,
      appraiseList: []
    }
  },
  computed: {
    showTop: function () {
      return this.scrollTop > 700
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getDetail();
    this.getAppraiseList(this.id);
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
      detail({
        id: this.id
      }).then(res => {
        Indicator.close()
        this.goodsInfo = res.data
        if (this.goodsInfo.mov) {
          this.type = 'video'
        } else {
          this.type = 'image'
        }
        this.skuId = this.goodsInfo.sku[0].id
        this.inventory = this.goodsInfo.sku[0].inventory
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
    openModel() {
      this.showStatus = true
    },
    call() {
      let vm = this;
      var html = `<div class='messageContent'>${vm.goodsInfo.tellphone}<div>`
      MessageBox({
        title: '',
        message: html,
        confirmButtonText: '呼叫',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          window.location.href = `tel://${vm.goodsInfo.tellphone}`
        }
      })
    },
    closeModel() {
      this.showStatus = false
    },
    chooseSku(id, inventory) {
      this.skuId = id;
      this.inventory = inventory
    },
    chooseCategory(category) {
      this.cateId = category.id;
      this.goodsInfo.salePrice = category.price;
    },
    buy() {
      let vm = this;
      if (vm.inventory < 1) {
        Toast({
          message: '该规格商品库存不足，请选择其他规格',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      if (this.goodsInfo.categoryList.length > 0 && !this.cateId) {
        Toast({
          message: '请选择套餐',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      vm.$router.push({
        path: '/settlement',
        query: {
          cargoId: vm.id,
          skuId: vm.skuId,
          cateId: this.cateId
        }
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
    getAppraiseList(id) {
      queryTopAppraiseByCargo({
        page: 1,
        limit: 20,
        id: id
      }).then(res => {
        this.appraiseList = res.data
      })
    },
    seeAll() {
      this.$router.push({
        path: '/appraiseList',
        query: {
          cargoId: this.id
        }
      });
    },
    seeAppraiseDetail(id) {
        this.$router.push({
        path: '/appraiseDetail',
        query: {
          appraiseId: id
        }
      });
    }
  }
}
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
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
      background: linear-gradient(to right, #0095FE, #0066FE);
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
        background: #0066FE;
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
        width: 100%;
      }
      p {
        padding: 0 0.94rem !important;
      }
    }
    .contents1 {
      font-size: 0.81rem;
      color: #000000;
      p {
        padding: 0 0.94rem !important;
      }
    }
  }
  .model {
    position: fixed;
    background: #fff;
    bottom: 0;
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
        background: linear-gradient(to right, #0095FE, #0066FE);
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
  .mask {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 888;
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
.messageContent {
  padding: 2rem 0;
  color: #0097ff;
}
.mint-msgbox-message {
  color: #0097ff;
}
.mint-msgbox-btns {
  height: 3.13rem;
}
.mint-msgbox-confirm {
  color: #0097ff;
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
.line {
  width: 0.19rem;
  height: 0.88rem;
  background: #F56C6C;
  margin-right: 0.47rem;
  color:#F56C6C;
}
</style>
