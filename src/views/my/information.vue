<template>
  <div class="information-container">
    <Header :title="title"></Header>
    <div class="input-box input-info">
      <div class="input">
        <label>姓名</label>
        <span>{{userInfo.name}}</span>
      </div>
      <div class="input">
        <label>性别</label>
        <span>{{userInfo.gender}}</span>
      </div>
      <div class="input">
        <label>身份证号</label>
        <span>{{userInfo.identity}}</span>
      </div>
      <div class="input">
        <label>所在地区</label>
        <span>{{userInfo.city}}</span>
      </div>
      <div class="input">
        <label>注册手机</label>
        <span>{{userInfo.phone}}</span>
      </div>
      <div class="input">
        <label>注册时间</label>
        <span>{{userInfo.createTime}}</span>
      </div>
    </div>
    <div class="input-box" style="margin-top:0.69rem">
      <div class="input">
        <label for="userName">安装电话</label>
        <input type="tel" v-model="installerMobile" placeholder="请输入安装电话" />
      </div>
    </div>
    <div class="prompt">*持卡人可直接联系安装电话</div>
    <div class="input-box">
      <div class="input">
        <label for="userName">开户人</label>
        <input type="text" v-model="bankHolder" placeholder="请输入开户主体姓名" />
      </div>
      <div class="input">
        <label for="userName">开户行</label>
        <input type="text" v-model="bank" placeholder="请输入开户行" />
      </div>
      <div class="input">
        <label for="userName">银行卡号</label>
        <input type="text" v-model="bankAccountNumber" placeholder="请输入银行卡号" />
      </div>
    </div>
    <div class="btn">
      <button @click="updateRetailerInfo">提交</button>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from 'mint-ui'
import Header from '@/components/Header'
import { agentCenter, updateRetailerInfo } from '@/api/index'
export default {
  name: 'information',
  components: { Header },
  data() {
    return {
      title: '完善资料',
      installerMobile: '',
      bankHolder: '',
      bank: '',
      bankAccountNumber: '',
      userInfo: ''
    }
  },
  watch: {
  },
  created() {
    this.agentCenter()
  },
  mounted() {
    document.title = '完善资料'
  },
  methods: {
    agentCenter() {
      let vm = this;
      agentCenter().then(res => {
        vm.userInfo = res.data
        vm.installerMobile = res.data.installerMobile
        vm.bankHolder = res.data.bankHolder
        vm.bank = res.data.bank
        vm.bankAccountNumber = res.data.bankAccountNumber
      })
    },
    updateRetailerInfo() {
      let vm = this;
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(vm.installerMobile))) {
        Toast({
          message: '请填写正确安装电话',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      if (!vm.bankHolder) {
        Toast({
          message: '请输入开户主体姓名',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      if (!vm.bank) {
        Toast({
          message: '请输入开户行',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      let pattern = /^[0-9]*$/;
      if (!pattern.test(vm.bankAccountNumber)) {
        Toast({
          message: '请填写正确的银行卡号',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      updateRetailerInfo({
        installerMobile: vm.installerMobile,
        bankHolder: vm.bankHolder,
        bank: vm.bank,
        bankAccountNumber: vm.bankAccountNumber
      }).then(res => {
        Indicator.close()
        Toast('信息提交成功')
      })
    }
  }
}
</script>

<style lang="less">
.information-container {
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
      }
      input:disabled {
        background: transparent;
      }
      input::placeholder {
        color: #999;
        font-size: 0.94rem;
      }
    }
  }
  .btn {
    margin-top: 2.34rem;
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
  .prompt {
    color: #e64340;
    font-size: 0.69rem;
    padding: 0.53rem 0 1.19rem 0.88rem;
  }
  .input-info {
    .input {
      border-bottom: none;
      color: #888888;
      font-size: 0.88rem;
      height: 2.2rem;
    }
  }
}
</style>
