<template>
  <div class="buyCard-container">
    <Header :title="title"></Header>
    <div class="card">
      <img src="@/assets/image/cards.png" />
      <div class="price">{{cardPrice}}元/套</div>
      <div class="inventory">库存：{{totalCount}}套</div>
    </div>
    <div class="choose">
      <div class="sub" @click="sub">
        <img src="@/assets/image/sub.png" />
      </div>
      <input
        type="number"
        class="num"
        v-reset-page
        v-model="count"
        οnkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"
      />
      <div class="add" @click="add">
        <img src="@/assets/image/add.png" />
      </div>
    </div>
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
    <div class="instructions">
      <div class="title">
        <span class="line"></span>
        <span>卡片说明</span>
      </div>
      <div>{{cardNote}}</div>
    </div>
    <div class="footer" v-if="isOriginHei">
      <div class="total">
        <div>
          数量：
          <span>{{count}}套共{{count*50}}张</span>
        </div>
        <div>
          合计：
          <span>￥{{count*cardPrice}}</span>
        </div>
      </div>
      <div class="btn" @click="buyCard">提交订单</div>
    </div>
  </div>
</template>

<script>
import { MessageBox, Toast, Indicator } from 'mint-ui'
import Header from '@/components/Header'
import { cardInfo, myAddress, buyCard } from '@/api/index'
export default {
  name: 'editAddress',
  components: { Header },
  data() {
    return {
      title: '购买卡片',
      cardPrice: '',
      totalCount: '',
      cardNote: '',
      count: 1,
      addressId: '',
      city: '',
      address: '',
      province: '',
      county: '',
      recipient: '',
      mobile: '',
      isOriginHei: true,
      documentHeight: document.documentElement.clientHeight
    }
  },
  watch: {
  },
  created() {
    this.cardInfo();
  },
  activated() {
    this.myAddress()
  },
  mounted() {
    document.title = '购买卡片'
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
    cardInfo() {
      let vm = this;
      cardInfo().then(res => {
        vm.cardPrice = res.data.cardPrice
        vm.totalCount = res.data.totalCount
        vm.cardNote = res.data.cardNote
      })
    },
    add() {
      let vm = this
      if (vm.count < vm.totalCount) {
        vm.count++
      }
    },
    sub() {
      let vm = this
      if (vm.count > 1) {
        vm.count--
      } else {
        Toast({
          message: '卡片购买不能少于1套',
          position: 'middle',
          duration: 2000
        })
      }
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
    chooseAddress() {
      this.$router.push({
        path: '/addressList'
      })
    },
    buyCard() {
      let vm = this;
      if (!vm.addressId) {
        Toast({
          message: '请选择收货地址',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      if (vm.count > vm.totalCount) {
        Toast({
          message: '库存不足,无法下单',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      MessageBox({
        title: '温馨提示',
        message: '是否购买卡片',
        confirmButtonText: '确定',
        showCancelButton: true,
        confirmButtonClass: 'confirmBtns'
      }).then(action => {
        if (action === 'confirm') {
          Indicator.open({
            text: 'Loading...',
            spinnerType: 'fading-circle'
          })
          buyCard({
            addressId: vm.addressId,
            count: vm.count
          }).then(res => {
            Indicator.close()
            if (res.code === 200) {
              let html = '<div style="color:#888888;">请保持电话的畅通，工作人员将在48小时内与您联系</div>'
              MessageBox({
                title: '提交申请成功',
                message: html,
                confirmButtonText: '我知道了',
                showCancelButton: false,
                confirmButtonClass: 'confirmBtn'
              }).then(action => {
                if (action === 'confirm') {
                  vm.$router.go(-1)
                }
              })
            } else {
              Toast(res.msg)
            }
          })
        }
      })
    },
    beforeRouteEnter(to, from, next) {
      if (from.path === '/card') {
        next(vm => {
          vm.$router.go(0)
        })
      } else {
        next()
      }
    }
  }
}
</script>

<style lang="less">
.buyCard-container {
  background: #f7f7f7;
  min-height: 100vh;
  .card {
    padding: 0.72rem 1.72rem 0 1.72rem;
    text-align: center;
    img {
      width: 20rem;
      height: 11.25rem;
    }
    .price {
      color: #e64340;
      font-size: 1.06rem;
      margin-top: 0.75rem;
    }
    .inventory {
      font-size: 0.75rem;
      color: #333333;
    }
  }
  .choose {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.06rem;
    color: #333333;
    img {
      width: 1.88rem;
      height: 1.88rem;
    }
    .num {
      background: #ffffff;
      border-radius: 0.31rem;
      width: 4.69rem;
      height: 1.69rem;
      text-align: center;
      line-height: 1.69rem;
      border: 0.03rem solid #dfdfdf;
      margin: 1.06rem 0.72rem 1.13rem 0.72rem;
      outline: none;
    }
  }
  .address {
    background: #fff;
    border-radius: 0.31rem;
    margin: 0 1.06rem;
    font-size: 0.94rem;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.28rem 0.75rem;
    img {
      width: 0.38rem;
      height: 0.69rem;
    }
  }
  .instructions {
    background: #fff;
    border-radius: 0.31rem;
    margin: 0.75rem 1.06rem 0 1.06rem;
    padding: 0.72rem;
    font-size: 0.75rem;
    color: #888888;
    .title {
      font-size: 0.94rem;
      color: #333333;
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      .line {
        width: 0.13rem;
        height: 0.88rem;
        background: #ff7200;
        margin-right: 0.47rem;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #ffffff;
    height: 3.06rem;
    display: flex;
    justify-content: space-between;
    .btn {
      background: linear-gradient(to right, #0095fe, #0066fe);
      font-size: 1.13rem;
      color: #ffffff;
      width: 6.25rem;
      line-height: 3.06rem;
      text-align: center;
    }
    .total {
      font-size: 0.88rem;
      color: #222222;
      margin-left: 1.03rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      span {
        color: #e64340;
      }
    }
  }
}
.confirmBtn {
  color: #0085fe !important;
  font-size: 1.06rem;
}
</style>
