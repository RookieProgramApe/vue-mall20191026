<template>
  <div class="my-container">
    <div class="my-top">
      <div class="my-logo">
        <div class="avatar">
          <img :src="userInfo.avatar" />
        </div>
        <router-link :to="{path:'/integral',query:{integral:userInfo.integral}}" class="item">
          <div class="intergal" v-if="userInfo">
            <div>{{userInfo.nickname}}</div>
            <div>安心值：{{userInfo.integral}}</div>
          </div>
        </router-link>
      </div>
      <div class="apply"  @click="goAgent">
        <img src="@/assets/image/my-intro.png" />
        <p>{{userInfo.isretailer=='1'?'合伙人中心':'加入合伙人'}}</p>
        <button>{{userInfo.isretailer=='1'?'GO >':'立即申请'}}</button>
      </div>
      <div class="my-item">
        <router-link to="/order" class="item">
          <div class="icon">
            <img src="@/assets/image/order.png" />
          </div>
          <div class="name">我的订单</div>
          <div class="arrow">
            <img src="@/assets/image/arrow-rights.png" />
          </div>
        </router-link>
        <router-link :to="{path:'/integral',query:{integral:userInfo.integral}}" class="item">
          <div class="icon">
            <img src="@/assets/image/icon001.png" />
          </div>
          <div class="name">我的安心值</div>
          <div class="arrow">
            <img src="@/assets/image/arrow-rights.png" />
          </div>
        </router-link>
        <router-link to="/addressList" class="item">
          <div class="icon">
            <img src="@/assets/image/address.png" />
          </div>
          <div class="name">地址管理</div>
          <div class="arrow">
            <img src="@/assets/image/arrow-rights.png" />
          </div>
        </router-link>
      </div>
      <div class="my-item">
        <div class="item" @click="call">
          <div class="icon">
            <img src="@/assets/image/phone.png" />
          </div>
          <div class="name">客服电话</div>
          <div class="arrow">
            <img src="@/assets/image/arrow-rights.png" />
          </div>
        </div>
        <router-link to="/about" class="item">
          <div class="icon">
            <img src="@/assets/image/about.png" />
          </div>
          <div class="name">关于我们</div>
          <div class="arrow">
            <img src="@/assets/image/arrow-rights.png" />
          </div>
        </router-link>
      </div>
    </div>
    <div class="footer">
      <router-link to="/index" class="item">
        <div>
          <img src="@/assets/image/mall-normal.png" />
        </div>
        <div>商城</div>
      </router-link>
      <router-link to="order" class="item">
        <div>
          <img src="@/assets/image/order-normal.png" />
        </div>
        <div>订单</div>
      </router-link>

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
      <div class="item active">
        <div>
          <img src="@/assets/image/my-active.png" />
        </div>
        <div>我的</div>
      </div>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import { myInfo, contact, getStatus } from '@/api/index'
export default {
  name: 'my',
  components: {},
  data() {
    return {
      agentStatus: true,
      userInfo: '',
      contactPhone: '',
      status: ''
    }
  },
  created() {
    this.myInfo()
    this.contact()
  },
  mounted() {
    document.title = '我的'
  },
  methods: {
    myInfo() {
      myInfo().then(res => {
        this.userInfo = res.data
      })
    },
    getApplyStatus() {
      let vm = this
      getStatus().then(res => {
        if (res.data !== null) {
          vm.status = res.data.status;
        }
      })
    },
    goAgent() {
      let vm = this;
      if (vm.userInfo.isretailer === 1) {
        vm.$router.push({
          path: '/agentCenter'
        })
      } else {
        if (vm.status !== '') {
          vm.$router.push({
            path: '/agentRegister'
          })
        } else {
          vm.$router.push({
            path: '/posters'
          })
        }
      }
    },
    contact() {
      contact().then(res => {
        this.contactPhone = res.data
      })
    },
    call() {
      let vm = this;
      var html = `<div class='messageContent'>${vm.contactPhone}<div>`
      MessageBox({
        title: '',
        message: html,
        confirmButtonText: '呼叫',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          window.location.href = `tel://${vm.contactPhone}`
        }
      })
    }
  }
}
</script>

<style lang="less">
.my-container {
  background: #f7f7f7;
  min-height: 100vh;
}
.my-top {
  height: 10.81rem;
  background-image: url("/static/img/my_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .apply {
    margin: 0 1.34rem;
    background: #fff;
    height: 4.38rem;
    border-radius: 2.19rem;
    display: flex;
    align-items: center;
    padding-left: 1.34rem;
    box-sizing: border-box;
    img {
      width: 5.25rem;
      margin-right: 0.31rem;
    }
    p {
      flex: 1;
    }
    font-size: 1.25rem;
    color: #ff7200;
    button {
      font-size: 0.75rem;
      color: #fff;
      background: linear-gradient(to right, #FF940F, #FF7500);
      padding: 0 0.44rem;
      height: 1.31rem;
      border-radius: 0.63rem;
      border: none;
      outline: none;
      margin-right: 0.94rem;
    }
  }
}
.my-top .my-logo {
  padding: 1.2rem 1.5rem 1.2rem 1.47rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 1.56rem;
  color: #fff;
  .avatar img {
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 50%;
  }
  .logo {
    display: flex;
    margin-left: 1.88rem;
    align-items: center;
    .arrow img {
      width: 1.25rem;
      height: 1.25rem;
      margin-left: 0.88rem;
    }
  }
  .intergal {
    color: #ffffff;
    margin-left: 1.13rem;
    div:nth-of-type(1) {
      font-size: 1.25rem;
    }
    div:nth-of-type(2) {
      font-size: 0.81rem;
    }
  }
}
.my-item {
  margin: 0.75rem 0.94rem 0 0.94rem;
  background: #fff;
  border-radius: 0.5rem;
  .item {
    height: 2.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.75rem 0 0.69rem;
    font-size: 0.94rem;
    color: #000000;
    border-bottom: 0.03rem solid #eeeeee;
    .name {
      flex: 1;
    }
    .arrow img {
      width: 0.38rem;
      height: 0.69rem;
    }
    .icon img {
      width: 1.25rem;
      height: 1.25rem;
      margin-right: 0.28rem;
    }
  }
  .item:last-child {
    border-bottom: none;
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
    color: #0085FE;
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
