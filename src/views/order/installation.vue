<template>
  <div class="installation-container">
    <Header :title="title"></Header>
    <div class="list">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div>
          <div class="name">{{item.name}}</div>
          <div class="date">{{item.duration}}</div>
        </div>
        <div class="call" @click="call(item.contact,item.id)"  v-if="item.id">
            安装下单
        </div>
         <div class="call1" @click="call1(item.contact)" v-if="!item.id">
            <img src="@/assets/image/call.png" />
        </div>
      </div>
    </div>
    <div class="empty" v-if="!list.length">
      <img src="@/assets/image/empty_02.png" />
      <div>暂未查询到内容</div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { MessageBox, Indicator } from 'mint-ui'
import { orderByaz, addOrder } from '@/api/index'
import Header from '@/components/Header'
export default {
  name: 'installation',
  components: { Header },
  data() {
    return {
      title: '申请安装',
      id: '',
      list: []
    }
  },
  created() {
    this.id = this.$route.query.id
    this.orderByaz()
  },
  mounted() {
    document.title = '申请安装'
  },
  methods: {
    orderByaz() {
      let vm = this
      orderByaz({
        id: vm.id
      }).then(res => {
        vm.list = res.data
        console.log(vm.list)
      })
    },
     call1(contact) {
      var html = `<div class='messageContent'>${contact}<div>`
      MessageBox({
        title: '',
        message: html,
        confirmButtonText: '呼叫',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          window.location.href = `tel://${contact}`
        }
      })
    },
    call(contact, id) {
       let vm = this
         MessageBox({
        title: '安装下单',
        message: '请问是否确定',
        confirmButtonText: '确定',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
           Indicator.open({
            text: 'Loading...',
            spinnerType: 'fading-circle'
          })
         addOrder({
           orderId: vm.id,
           installerId: id
           }).then(res => {
            Indicator.close()
            wx.ready(function () {
                // 支付修改
                // let payConfig = res.data.payload.metadata
                let payConfig = res.data.payload;
                wx.chooseWXPay({
                  'timestamp': payConfig.timeStamp,
                  'nonceStr': payConfig.nonceStr,
                    'package': payConfig.packageValue,
                  'signType': payConfig.signType,
                  'paySign': payConfig.paySign,
                  'success': function (result) {
                    // vm.$router.push('/paySuccess')
                  },
                  'fail': function (result) {
                    console.log(result)
                  },
                  'complete': function (result) {
                    console.log(result)
                  }
                })
              })
              })
        }
      })
    }
  }
  }
</script>
<style lang="less" scoped>
.installation-container {
  min-height: 100vh;
  background: #f7f7f7;
  .list {
    padding: 0 0.94rem;
    .item {
      background: #ffffff;
      border-radius: 0.31rem;
      padding: 1.13rem 0.66rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.75rem;
      .call{
        width: 3.75rem;
        height: 1.25rem;
        font-size: 0.75rem;
        border: 0.01rem solid #0097ff !important;
        text-align: center;
        line-height: 1.25rem;
      }
       .call1 img {
        width: 3.75rem;
        height: 1.25rem;
      }
      .name {
        color: #ff7200;
        font-size: 0.94rem;
      }
      .date {
        color: #888888;
        font-size: 0.75rem;
      }
    }
  }
  .empty {
    font-size: 0.75rem;
    color: #999;
    text-align: center;
    img {
      margin-top: 11.5rem;
      width: 12.5rem;
      margin-bottom: 1rem;
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
  border-right: 0.03rem solid #ddd !important;
}
.mint-msgbox-btn {
  border: 0.01rem solid #ddd !important;
  border-top: none !important;
  border-bottom: none !important;
}
</style>
