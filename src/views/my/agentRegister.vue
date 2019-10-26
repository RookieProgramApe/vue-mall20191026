<template>
  <div class="agentRegister-container">
    <Header :title="title"></Header>
    <div class="aduit" v-if="status!==''">
      <div
        :style="{color:status=='0'?'#333333':''}"
      >{{status=='0'?'待审核':status=='1'?'审核通过':status=='99'?'审核不通过':''}}</div>
      <div class="reson" v-if="approvalComment">审核意见：{{approvalComment}}</div>
    </div>
    <div class="input-box" v-if="status===''">
      <div class="input">
        <label for="phone">注册手机</label>
        <input type="tel" :disabled="status!==''" v-model="phone" placeholder="请输入手机号码" />
      </div>
      <div class="input">
        <label for="code">验证码</label>
        <input type="number" v-model="code" placeholder="请输入验证码" style="width:4rem;" />
        <span class="code" @click="getCode" v-if="!getStatus">获取验证码</span>
        <span class="code" v-if="getStatus" style="color:#888">{{time}}S</span>
      </div>
    </div>
    <div class="input-box" style="margin-top:0.75rem">
      <div class="input">
        <label for="userName">姓名</label>
        <input type="text" v-model="name" placeholder="请输入姓名" />
      </div>
      <div class="input">
        <group class="group">
          <popup-picker
            title="性别"
            :data="sexArr"
            v-model="gender"
            placeholder="点击选择性别"
            value-text-align="left"
          ></popup-picker>
        </group>
      </div>
      <div class="input">
        <label for="idCard">身份证号</label>
        <input type="text" v-model="identity" placeholder="请输入身份证号" />
      </div>
      <div class="input">
        <x-address
          placeholder="点击选择所在地区"
          :raw-value="true"
          title="所在地区"
          v-model="city"
          :list="addressData"
        ></x-address>
      </div>
    </div>
    <div class="btn">
      <button @click="submit">{{status!==''?'重新提交':'提交'}}</button>
    </div>
  </div>
</template>

<script>
import { Toast, MessageBox, Indicator } from 'mint-ui'
import Header from '@/components/Header'
import { join, sendSms, getStatus } from '@/api/index'
import { PopupPicker, Group, XAddress, ChinaAddressV4Data, Value2nameFilter as value2name } from 'vux'
export default {
  name: 'agentRegister',
  components: { Header, PopupPicker, Group, XAddress },
  data() {
    return {
      title: '代理商申请',
      name: '',
      identity: '',
      sexArr: [['男', '女']],
      gender: undefined,
      addressData: ChinaAddressV4Data,
      city: [],
      phone: '',
      code: '',
      send_code: '',
      getStatus: false,
      time: 60,
      status: '',
      parentMemberId: '',
      approvalComment: '',
      isOriginHei: true,
      documentHeight: document.documentElement.clientHeight
    }
  },
  watch: {
  },
  created() {
    if (this.$route.query.parentMemberId) {
      this.parentMemberId = this.$route.query.parentMemberId
    }
    this.getApplyStatus();
  },
  mounted() {
    document.title = '代理商申请'
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
    getName(value) {
      return value2name(value, ChinaAddressV4Data)
    },
    submit() {
      let vm = this
      if (!vm.name || !vm.gender || !vm.phone || !vm.city.length || !vm.identity) {
        Toast({
          message: '请填写完整信息',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(vm.phone))) {
        Toast({
          message: '请填写正确手机号码',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
      if (!reg.test(vm.identity)) {
        Toast({
          message: '请输入正确的身份证号码',
          position: 'middle',
          duration: 2000
        })
        return false;
      }
      if (vm.send_code !== vm.code && vm.status === '' && vm.code === '') {
        Toast({
          message: '验证码不正确',
          position: 'middle',
          duration: 2000
        })
        return false;
      }
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      join({
        name: vm.name,
        phone: vm.phone,
        city: vm.getName(vm.city),
        gender: vm.gender[0],
        identity: vm.identity,
        parentMemberId: vm.parentMemberId
      }).then(res => {
        Indicator.close()
        if (res.code === 200) {
          if (vm.status === '') {
            MessageBox({
              title: '温馨提示',
              message: '提交成功，请保持电话畅通，耐心等待平台工作人员的审核',
              showCancelButton: false
            }).then(action => {
              if (action === 'confirm') {
                vm.$router.push({
                  path: '/my'
                })
              }
            })
          } else {
            vm.$router.push({
              path: '/my'
            })
          }
        }
      })
    },
    getTimeOut() {
      let vm = this
      vm.time = 60;
      let timer = setInterval(function () {
        if (vm.time !== 0) {
          vm.time--
        } else {
          vm.getStatus = false
          clearInterval(timer)
          vm.time = 60
        }
      }, 1000)
    },
    getCode() {
      let vm = this
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(vm.phone))) {
        Toast('请填写正确手机号码');
        return false
      }
      vm.getStatus = true
      vm.getTimeOut()
      sendSms({
        mobile: vm.phone
      }).then(res => {
        vm.send_code = res.data
        Toast('验证码发送成功')
      })
    },
    getApplyStatus() {
      let vm = this
      getStatus().then(res => {
        if (res.data !== null) {
          vm.status = res.data.status;
          vm.phone = res.data.phone
          vm.approvalComment = res.data.approvalComment;
          vm.city = res.data.city.split(' ')
          vm.name = res.data.name
          vm.identity = res.data.identity
          vm.gender = [res.data.gender]
        }
      })
    }
  }
}
</script>

<style lang="less">
.agentRegister-container {
  background: #f7f7f7;
  min-height: 100vh;
  .input-box {
    background: #fff;
    .input {
      display: flex;
      align-items: center;
      font-size: 0.94rem;
      color: #333333;
      height: 2.81rem;
      padding: 0 0.94rem;
      border-bottom: 0.03rem solid #eeeeee;
      label {
        min-width: 5.3rem;
      }
      input {
        flex: 1;
        border: none;
        outline: none;
        width: 100%;
        font-size: 0.94rem;
      }
      input:disabled {
        font-size: 0.94rem;
        background: transparent;
      }
      input::placeholder {
        color: #999;
        font-size: 0.94rem;
      }
      .code {
        width: 6.87rem;
        text-align: center;
        height: 1.94rem;
        line-height: 1.94rem;
        border-left: 0.03rem solid #e0dfdf;
        display: inline-block;
        color: #0066fe;
        font-size: 1.06rem;
      }
      .weui-label {
        font-size: 0.94rem;
      }
    }
    .group {
      width: 100%;
      .vux-no-group-title {
        margin-top: 0 !important;
      }
    }
    .weui-cell {
      padding: 0 !important;
    }
    .weui-cells:before {
      border-top: none !important;
    }
    .weui-cells:after {
      border-bottom: none !important;
    }
  }
  .aduit {
    padding: 0.66rem 0.91rem;
    font-size: 0.94rem;
    color: #e64340;
    .reson {
      font-size: 0.75rem;
      color: #333333;
    }
  }
  .btn {
    margin-top: 10rem;
    padding: 0 0.91rem;
    button {
      height: 2.81rem;
      line-height: 2.81rem;
      background: linear-gradient(to right, #0095fe, #0066fe);
      border-radius: 0.31rem;
      color: #ffffff;
      font-size: 1.13rem;
      outline: none;
      border: none;
      width: 100%;
    }
  }
}
.vux-cell-box {
  width: 100% !important;
}
.vux-popup-picker-select {
  text-align: left !important;
}
.vux-popup-picker-placeholder {
  font-size: 0.94rem;
}
.vux-popup-header-right {
  color: #0085fe !important;
}
.vux-popup-picker-value {
  font-size: 0.94rem !important;
  color: #333333 !important;
}
.vux-cell-box .weui-cell .vux-tap-active .weui-cell_access {
  display: flex !important;
}
</style>
