<template>
  <div class="editAddress-container">
    <Header :title="title"></Header>
    <div class="input-box">
      <div class="input">
        <label for="userName">收货人</label>
        <input type="text" v-model="recipient" placeholder="请输入收货人" />
      </div>
      <div class="input">
        <label for="userName">手机号码</label>
        <input type="tel" v-model="mobile" placeholder="请输入手机号码" />
      </div>
      <div class="input">
        <group class="group">
          <x-address
            placeholder="点击选择所在地区"
            :raw-value="true"
            title="所在地区"
            v-model="city"
            :list="addressData"
          ></x-address>
        </group>
      </div>
      <div class="input">
        <label for="userName">详细地址</label>
        <input type="text" v-model="address" placeholder="请输入详细地址" />
      </div>
    </div>
    <div class="check" @click="changedDefault">
      <img :src="defaultAddress ? img_1 : img_2" />
      <span>设置为默认地址</span>
    </div>
    <div class="btn">
      <button @click="saveAddress">保存</button>
      <button v-if="id" @click="delAddress">删除</button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import Header from '@/components/Header'
import { saveAddress, addressDetail, deleteAddress } from '@/api/index'
import { XAddress, Group, ChinaAddressV4Data, Value2nameFilter as value2name } from 'vux'
export default {
  name: 'editAddress',
  components: { Header, Group, XAddress },
  data() {
    return {
      id: '',
      title: '添加地址',
      mobile: '',
      recipient: '',
      addressData: ChinaAddressV4Data,
      city: [],
      address: '',
      img_1: require('@/assets/image/check-on.png'),
      img_2: require('@/assets/image/check-un.png'),
      defaultAddress: 0
    }
  },
  watch: {
  },
  created() {
    let vm = this;
    vm.id = vm.$route.query.id
    if (vm.id) {
      addressDetail({
        id: vm.id
      }).then(res => {
        vm.mobile = res.data.mobile
        vm.address = res.data.address
        vm.recipient = res.data.recipient
        vm.city = [res.data.province, res.data.city, res.data.county]
        vm.defaultAddress = res.data.defaultAddress
      })
    }
  },
  mounted() {
    document.title = '添加地址'
  },
  methods: {
    getName(value) {
      return value2name(value, ChinaAddressV4Data)
    },
    saveAddress() {
      let vm = this
      if (!vm.recipient || !vm.mobile || !vm.address || !vm.city.length) {
        Toast({
          message: '请填写完整收货信息',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(vm.mobile))) {
        Toast({
          message: '请填写正确手机号码',
          position: 'middle',
          duration: 2000
        })
        return false
      }
      saveAddress({
        id: vm.id,
        province: vm.getName(vm.city).split(' ')[0],
        city: vm.getName(vm.city).split(' ')[1],
        county: vm.getName(vm.city).split(' ')[2],
        mobile: vm.mobile,
        address: vm.address,
        recipient: vm.recipient,
        defaultAddress: vm.defaultAddress
      }).then(res => {
        vm.$router.go(-1)
      })
    },
    delAddress() {
      let vm = this
      deleteAddress({
        id: vm.id
      }).then(res => {
        vm.$router.go(-1)
      })
    },
    changedDefault() {
      this.defaultAddress = !this.defaultAddress
    }
  }
}
</script>

<style lang="less">
.editAddress-container {
  background: #f7f7f7;
  min-height: 100vh;
  .input-box {
    background: #fff;
    .input {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: #333333;
      height: 2.81rem;
      padding: 0 1rem;
      border-bottom: 0.03rem solid #eeeeee;
      label {
        min-width: 5.3rem;
      }
      input {
        flex: 1;
        border: none;
        outline: none;
      }
      input::placeholder {
        color: #999;
        font-size: 0.9rem;
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
  .btn {
    margin-top: 6.28rem;
    padding: 0 1.5rem;
    button {
      height: 2.75rem;
      line-height: 2.75rem;
      background: linear-gradient(to right, #0095FE, #0066FE);
      border-radius: 0.31rem;
      color: #ffffff;
      font-size: 1.13rem;
      outline: none;
      border: none;
      width: 100%;
    }
    button:nth-of-type(2) {
      background: transparent;
      border: 0.04rem solid #0066FE;
      color: #0066FE;
      margin-top: 0.75rem;
    }
  }
  .check {
    padding: 1.06rem 0 0 0.84rem;
    font-size: 0.81rem;
    color: #000000;
    display: flex;
    align-items: center;
    img {
      width: 1.25rem;
      height: 1.25rem;
      margin-right: 0.84rem;
    }
  }
}
.vux-cell-box {
  width: 100% !important;
}
.vux-popup-picker-select {
  text-align: left !important;
}
.vux-popup-header-right {
  color: #0085FE !important;
}
.vux-popup-picker-placeholder {
  font-size: 0.9rem !important;
}
.vux-popup-picker-value {
  font-size: 0.9rem;
  color: #333333 !important;
}
.vux-cell-box .weui-cell .vux-tap-active .weui-cell_access {
  display: flex !important;
}
</style>
