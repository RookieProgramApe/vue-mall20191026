<template>
  <div class="order-container page-loadmore-wrapper page-loadmore-top">
    <div class="nav">
      <tab
        :line-width="2"
        custom-bar-width="1.81rem"
        active-color="#0085FE"
        default-color="#262626"
        bar-active-color="#0085FE"
      >
        <tab-item selected @on-item-click="setType('0')">全部</tab-item>
        <tab-item @on-item-click="setType('2')">已支付</tab-item>
        <tab-item @on-item-click="setType('3')">已发货</tab-item>
        <tab-item @on-item-click="setType('4')">已完成</tab-item>
      </tab>
    </div>
    <mt-loadmore
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :autoFill="false"
      bottomPullText
      ref="loadmore"
      style="min-height:calc(100vh - 3.06rem);padding-top: 3.47rem;"
    >
      <div v-if="!list.length" class="empty">
        <img src="@/assets/image/empty.png" />
      </div>
      <div class="order-list" v-for="(item,index) in list" :key="index">
        <div class="item">
          <div class="status">
            <span>{{item.createTime}}</span>
            <span>{{item.status=='2'?'已支付':item.status=='3'?'已发货':item.status=='4'?'已完成':''}}</span>
          </div>
          <div class="detail">
            <div class="icon">
              <img :src="item.cargoImage" />
            </div>
            <div class="price">
              <div style="flex:1">
                <p class="name am-line-2">{{item.cargoName}}</p>
                <div class="sku" v-if="item.skuName">
                  <div>{{item.cateName == null || item.cateName == ""?item.skuName:item.skuName + " | " + item.cateName}}</div>
                </div>
                <!-- 免费领取 -->
                <div v-if="item.type=='3'" class="sku">
                  <div v-if="item.giftcardNum">免费领取</div>
                  <div v-else>积分兑换</div>
                </div>
              </div>
              <div class="num">
                <p style="margin-top:0.59rem">￥{{item.unitPrice}}</p>
                <p>x{{item.count}}</p>
              </div>
            </div>
          </div>
          <div class="total">
            <div v-show="item.giftcardNum">提货卡号：{{item.giftcardNum}}</div>
            <div>
              <span style="color:#333333">合计：</span>
              <span v-if="item.type==3" style="color:#E64340;font-size:1.06rem">❤{{item.point}} + </span>
              <span style="color:#E64340;font-size:1.06rem">¥{{item.totalPrice}}</span>
            </div>
          </div>
          <div class="total" v-if="item.status==3">
            <div>
              <span style="color:#333;">物流信息：</span>
              <span style="marin:0 .3rem;color:#666;">{{item.deliveryProvider}}</span>
              <span>{{item.deliveryTrack}}</span>
            </div>
            <div>
              <button @click="findLogistics(item.id)">查看物流</button>
            </div>
          </div>
          <div class="option">
            <div>
              <span @click="call(item.phone)">客服电话</span>
              <span v-if="item.appraiseId == 0" style="float: right;" @click="appraise(item)">评价</span>
              <span v-else style="float: right;" @click="seeAppraise(item)">查看评价</span>
            </div>
            <div>
              <span v-if="item.status==4" @click="orderByaz(item.id)">申请安装</span>
              <span v-if="item.status==3" @click="endOrder(item.id,index)">确认收货</span>
            </div>
          </div>
        </div>
      </div>
      <div class="loadmore" v-if="list.length&&!allLoaded">
        <div>上拉加载更多</div>
      </div>
      <div class="loadmore" v-if="list.length&&allLoaded">
        <div>已经最底线了</div>
      </div>
    </mt-loadmore>
    <div class="footer">
      <router-link to="/index" class="item">
        <div>
          <img src="@/assets/image/mall-normal.png" />
        </div>
        <div>商城</div>
      </router-link>
      <div class="item active">
        <div>
          <img src="@/assets/image/order-active.png" />
        </div>
        <div>订单</div>
      </div>

      <!--        新增-->
      <router-link to="/credit" class="item">
        <div>
          <img src="@/assets/image/icon002.png" />
        </div>
        <div>安心城</div>
      </router-link>

      <router-link to="/bargaining" class="item">
        <div>
          <img src="@/assets/image/bargaining-normal.png" />
        </div>
        <div>砍价</div>
      </router-link>
      <router-link to="/my" class="item">
        <div>
          <img src="@/assets/image/my-normal.png" />
        </div>
        <div>我的</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Loadmore, Indicator, Toast, MessageBox } from 'mint-ui'
import { Tab, TabItem } from 'vux'
import { order, endOrder } from '@/api/index'
export default {
  name: 'order',
  components: { Tab, TabItem, Loadmore },
  data() {
    return {
      page: 1,
      limit: 20,
      status: 0,
      list: [],
      totalPage: '',
      allLoaded: true
    }
  },
  created() {
    this.getOrder()
  },
  mounted() {
    document.title = '我的订单'
  },
  methods: {
    setType(status) {
      this.status = status
      this.page = 1
      this.getOrder()
    },
    appraise(item) {
      this.$router.push({
        path: '/appraise',
        query: {
          cargoId: item.cargoId,
          orderId: item.id,
          skuName: item.skuName,
          cateName: item.cateName
        }
      })
    },
    seeAppraise(item) {
      this.$router.push({
        path: '/appraiseDetail',
        query: {
          appraiseId: item.appraiseId
        }
      })
    },
    getOrder() {
      let vm = this
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      order({
        page: vm.page,
        limit: vm.limit,
        status: vm.status
      }).then(res => {
        Indicator.close()
        vm.list = res.data
        vm.totalPage = res.total
        if (vm.page < vm.totalPage) {
          vm.allLoaded = false
        }
      })
    },
    loadBottom() {
      let vm = this
      vm.page++;
      order({
        page: vm.page,
        limit: vm.limit,
        status: vm.status
      }).then(res => {
        let newlist = res.data;
        vm.list = vm.list.concat(newlist)
        this.$refs.loadmore.onBottomLoaded()
        if (vm.page < vm.totalPage) {
          vm.allLoaded = false
        } else {
          vm.allLoaded = true
        }
      })
    },
    loadTop() {
      let vm = this
      vm.page = 1
      vm.allLoaded = true
      order({
        page: vm.page,
        limit: vm.limit,
        status: vm.status
      }).then(res => {
        vm.list = res.data;
        this.$refs.loadmore.onTopLoaded()
        if (vm.page < vm.totalPage) {
          vm.allLoaded = false
        } else {
          vm.allLoaded = true
        }
      })
    },
    call(phone) {
      var html = `<div class='messageContent'>${phone}<div>`
      MessageBox({
        title: '',
        message: html,
        confirmButtonText: '呼叫',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          window.location.href = `tel://${phone}`
        }
      })
    },
    endOrder(id, index) {
      let vm = this
      MessageBox({
        title: '温馨提示',
        message: '是否确认收货',
        confirmButtonText: '确定',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          endOrder({
            id: id
          }).then(res => {
            if (res.code === 200) {
              Toast('收货成功')
              vm.list.splice(index, 1)
            }
          })
        }
      })
    },
    orderByaz(id) {
      this.$router.push({
        path: '/installation',
        query: {
          id: id
        }
      })
    },
    findLogistics(id) {
      this.$router.push({
        path: '/express',
        query: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="less">
.order-container {
  min-height: 100vh;
  padding-bottom: 3.06rem;
  background: #f7f7f7;
  .nav {
    height: 2.72rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
  }
  .empty {
    position: relative;
    margin-top: 11.72rem;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 12.5rem;
      height: 10rem;
      margin-top: -3.36rem;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    height: 3.06rem;
    font-size: 0.63rem;
    display: flex;
    align-items: center;
    .item {
      flex: 1;
      text-align: center;
    }
    a {
      color: #333333;
    }
    img {
      width: 1.38rem;
      height: 1.38rem;
    }
    .active {
      color: #0085fe;
    }
  }
  .order-list {
    .item {
      background: #fff;
      margin-bottom: 0.75rem;
      padding: 0 0.94rem;
      .status {
        height: 1.75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.75rem;
        color: #333333;
        border-bottom: 0.03rem solid #eeeeee;
      }
      .detail {
        display: flex;
        align-items: flex-start;
        padding: 0.75rem;
        .icon img {
          width: 4.69rem;
          height: 4.69rem;
        }
        .price {
          display: flex;
          flex: 1;
          font-size: 0.75rem;
          margin-left: 1.03rem;
          align-items: flex-start;
          .name {
            font-size: 0.75rem;
            color: #000000;
            margin: 0.59rem 0;
            margin-right: 2.16rem;
          }
          .sku {
            div {
              background: #f2f2f2;
              display: inline-block;
              width: 5rem;
              height: 1.38rem;
              border-radius: 0.31rem;
              line-height: 1.38rem;
              text-align: center;
              font-size: 0.69rem;
              color: #888888;
            }
          }
        }
        .num {
          font-size: 0.75rem;
          color: #000000;
          text-align: right;
          width: 3.88rem;
          p {
            margin: 0;
          }
        }
      }
      .total {
        display: flex;
        align-items: center;
        font-size: 0.75rem;
        color: #888888;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 0.03rem solid #eeeeee;
        button {
          border: 0.04rem solid #666666;
          font-size: 0.63rem;
          border-radius: 0.75rem;
          background: transparent;
          width: 4.69rem;
          height: 1.5rem;
          line-height: 1.5rem;
          padding: 0;
        }
      }
      .option {
        // display: flex;
        align-items: center;
        font-size: 0.75rem;
        color: #F56C6C;
        span {
          display: inline-block;
          width: 4.69rem;
          height: 1.5rem;
          line-height: 1.5rem;
          text-align: center;
          box-sizing: border-box;
          // border-radius: 0.75rem;
          border: 0.04rem solid #F56C6C;
        }
        padding: 0.63rem 0 0.81rem 0;
        div:nth-of-type(2) {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          span {
            background: linear-gradient(to right, #0095fe, #0066fe);
            color: #ffffff;
          }
        }
      }
    }
  }
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
  border-right: 0.01rem solid #ddd !important;
}
.mint-msgbox-btn {
  border: 0.01rem solid #ddd !important;
  border-top: none !important;
  border-bottom: none !important;
}
</style>
