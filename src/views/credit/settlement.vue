<template>
  <div class="settlement-container">
    <Header :title="title"></Header>
    <div class="address" @click="chooseAddress">
      <div v-if="addressId">
        <div style="font-size:0.94rem">
          <span style="color:#333;margin-right:0.75rem">{{recipient}}</span>
          <span style="color:#666">{{mobile}}</span>
        </div>
        <div style="color:#777;">{{province}}{{city}}{{county}}{{address}}</div>
      </div>
      <div v-if="!addressId">请添加收货地址</div>
      <img src="@/assets/image/arrow-rights.png" />
    </div>
    <div class="goods">
      <div class="detail">
        <div class="icon">
          <img :src="goodsInfo.picture" />
        </div>
        <div class="price">
          <div>
            <p class="name am-line-2">{{goodsInfo.name}}</p>
            <!-- <div class="sku">
              <div>{{skuName}}</div>
            </div> -->
          </div>
          <div class="num">
            <p style="margin-top:0.59rem">￥{{goodsInfo.salePrice}}</p>
            <p>x1</p>
          </div>
        </div>
      </div>
      <div class="desc">
        <div class="item">
          <label>购买数量</label>
          <span>1件</span>
        </div>
        <div class="item">
          <label>订单备注</label>
          <input v-reset-page placeholder="选填" v-model="remark" />
        </div>
        <!-- <div class="item">
          <label>
            可用积分{{credit}}抵用
            <span style="margin-left:0;color:#E64340;">{{discount}}</span>元
          </label>
          <group>
            <x-switch title v-model="isDeduct" @on-change="switchChange"></x-switch>
          </group>
        </div> -->
      </div>
    </div>
    <div class="input-box" v-if="goodsInfo.iscard == 1">
      <div>
        <label>卡号</label>
        <input v-reset-page type="text" placeholder="请输入卡号" v-model="cardNum" />
      </div>
      <div>
        <label>卡密</label>
        <input v-reset-page type="password" placeholder="请输入卡密" v-model="cardPwd" />
      </div>
    </div>
    <div class="btn" v-show="isOriginHei">
      <span>共1件 合计：</span>
      <span style="color:#E64340;">
        ❤ <span style="font-size:1.31rem">{{point}}</span>
      </span> +
      <span style="color:#E64340;">
        ¥ <span style="font-size:1.31rem">{{salePrice}}</span>
      </span>
      <button @click="submit">提交订单</button>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { MessageBox, Toast, Indicator } from 'mint-ui'
import { myInfo, creditDetail, myAddress, getCredit, creditPay } from '@/api/index'
import Header from '@/components/Header'
import { XSwitch, Group } from 'vux'
export default {
  name: 'settlement',
  components: { Header, Group, XSwitch },
  data() {
    return {
      title: '订单结算',
      cargoId: '',
      // skuId: '',
      skuName: '',
      province: '',
      city: '',
      county: '',
      address: '',
      addressId: '',
      isDeduct: false,
      goodsInfo: '',
      cardNum: '',
      cardPwd: '',
      remark: '',
      credit: '',
      discount: '',
      recipient: '',
      mobile: '',
      isOriginHei: true,
      documentHeight: document.documentElement.clientHeight,
      salePrice: '',
      userInfo: '',
      point: ''
    }
  },
  created() {
    this.cargoId = this.$route.query.cargoId
    // this.skuId = this.$route.query.skuId
    this.getDetail()
    // this.getCredit()
  },
  activated() {
    this.myAddress()
  },
  mounted() {
    document.title = '订单结算'
    window.onresize = () => {
      return (() => {
        if (this.documentHeight > document.documentElement.clientHeight) {
          this.isOriginHei = false
        } else {
          this.isOriginHei = true
        }
      })()
    }
  },
  methods: {
    myInfo() {
      myInfo().then(res => {
        this.userInfo = res.data
      })
    },
    getDetail() {
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      creditDetail({
        id: this.cargoId
      }).then(res => {
        this.goodsInfo = res.data
        this.salePrice = this.goodsInfo.salePrice;
        this.point = this.goodsInfo.point;
        Indicator.close()
        // this.goodsInfo.sku.forEach((item) => {
        //   if (item.id === this.skuId) {
        //     this.skuName = item.name
        //   }
        // })
      })
    },
    chooseAddress() {
      this.$router.push({
        path: '/addressList'
      })
    },
    myAddress() {
      myAddress().then(res => {
        if (res.data !== null) {
          this.province = res.data.province
          this.city = res.data.city
          this.county = res.data.county
          this.address = res.data.address
          this.addressId = res.data.id
          this.recipient = res.data.recipient
          this.mobile = res.data.mobile
        } else {
          this.province = ''
          this.city = ''
          this.county = ''
          this.address = ''
          this.addressId = ''
          this.recipient = ''
          this.mobile = ''
        }
      })
    },
    getCredit() {
      getCredit().then(res => {
        if (res.data !== null) {
          this.credit = res.data.credit
          this.discount = res.data.discount
        }
      })
    },
    submit() {
      let vm = this;
      if (!vm.addressId) {
        Toast({
          message: '请选择收货地址',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      if (!vm.cardNum && vm.goodsInfo.iscard === 1) {
        Toast({
          message: '请填写卡号',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      if (!vm.cardPwd && vm.goodsInfo.iscard === 1) {
        Toast({
          message: '请填写卡密',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      MessageBox({
        title: '温馨提示',
        message: '您确定下单吗?',
        confirmButtonText: '确定',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          Indicator.open({
            text: 'Loading...',
            spinnerType: 'fading-circle'
          })

          // 判断积分是否足够
          myInfo().then(res => {
            if (res.data.integral < this.goodsInfo.point) {
              Toast({
                message: '您的安心值余额不足',
                position: 'middle',
                duration: 2000
              })
            }
          })

          creditPay({
            addressId: vm.addressId,
            cardNum: vm.cardNum,
            cardPwd: vm.cardPwd,
            cargoId: vm.cargoId,
            isDeduct: vm.isDeduct ? 1 : 0,
            // skuId: vm.skuId,
            remark: vm.remark
          }).then(res => {
            Indicator.close()
            if (res.data.ret_code === '0000') {
              wx.ready(function () {
                // 支付修改
                  //  let payConfig = res.data.payload.metadata
                let payConfig = res.data.payload
                wx.chooseWXPay({
                  'timestamp': payConfig.timeStamp,
                  'nonceStr': payConfig.nonceStr,
                  'package': payConfig.packageValue,
                  'signType': payConfig.signType,
                  'paySign': payConfig.paySign,
                  'success': function (result) {
                    vm.$router.push('/paySuccess')
                  },
                  'fail': function (result) {
                    console.log(result)
                  },
                  'complete': function (result) {
                    console.log(result)
                  }
                })
              })
            } else if (res.data.ret_code === '1111') {
              vm.$router.push('/creditPaySuccess');
            }
          })
        }
      })
    },
      switchChange() {
          let vm = this
          if (vm.isDeduct) {
              vm.salePrice = Number(vm.skuPrice - vm.discount).toFixed(2)
          } else {
              vm.salePrice = vm.skuPrice
          }
      }
  },
  beforeRouteEnter(to, from, next) {
    if (from.path === '/creditDetail') {
      next(vm => {
        vm.$router.go(0)
      })
    } else {
      next()
    }
  }
}
</script>

<style lang="less">
.settlement-container {
  min-height: 100vh;
  background: #f7f7f7;
  padding-bottom: 3.09rem;
  .address {
    background: #fff;
    border-radius: 0.31rem;
    margin: 0 0.94rem;
    font-size: 0.94rem;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.28rem 0.75rem;
    margin-top: 0.75rem;
    img {
      width: 0.88rem;
      height: 0.88rem;
    }
  }
  .goods {
    background: #fff;
    margin: 0.75rem 0.94rem;
    border-radius: 0.31rem;
    .detail {
      display: flex;
      align-items: flex-start;
      padding: 0.72rem;
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
        div:nth-of-type(1) {
          flex: 1;
        }
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
            height: 1.38rem;
            padding: 0 0.63rem;
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
    .desc {
      .item {
        height: 2.75rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        color: #888888;
        padding: 0 0.72rem;
        border-bottom: 0.03rem solid #eeeeee;
        label {
          color: #000000;
        }
        span {
          flex: 1;
          margin-left: 1rem;
        }
        input {
          flex: 1;
          margin-left: 1rem;
          border: none;
          font-size: 0.75rem;
          outline: none;
        }
      }
      div:last-child {
        border-bottom: none;
      }
    }
  }
  .vux-no-group-title {
    margin: 0 !important;
  }
  .weui-cells:before {
    border-top: none !important;
  }
  .weui-cells:after {
    border-bottom: none !important;
  }
  .vux-x-switch {
    padding: 0 !important;
  }
  .weui-switch:checked,
  .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
    background-color: #0066FE !important;
    border-color: #0066FE !important;
  }
  .weui-cell_switch .weui-cell__ft {
    transform: scale(0.6) !important;
  }
  .btn {
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 999;
    height: 3.06rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 0.88rem;
    color: #222222;
    border-top: 0.03rem solid #eee;
    button {
      background: linear-gradient(to right, #0095FE, #0066FE);
      height: 3.06rem;
      font-size: 1.13rem;
      color: #ffffff;
      width: 6.25rem;
      text-align: center;
      border: none;
      outline: none;
      margin-left: 1.06rem;
      box-sizing: border-box;
    }
  }
  .input-box {
    background: #fff;
    border-radius: 0.31rem;
    margin: 0 0.94rem;
    font-size: 0.94rem;
    color: #333333;
    div {
      height: 2.81rem;
      display: flex;
      align-items: center;
      padding: 0 0.94rem;
    }
    input {
      flex: 1;
      margin-left: 2rem;
      border: none;
      outline: none;
    }
    div:nth-of-type(1) {
      border-bottom: 0.03rem solid #eeeeee;
    }
  }
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
