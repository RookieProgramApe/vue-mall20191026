<template>
  <div class="addressList-container">
    <Header :title="title"></Header>
    <div class="address-box">
      <div class="list" v-for="(item,index) in address" :key="index">
        <div @click="chooseAddress(item)">
          <div class="name">{{item.recipient}}</div>
          <div v-show="item.defaultAddress">
            <div class="default">默认</div>
          </div>
        </div>
        <div class="info" @click="chooseAddress(item)">
          <div class="phone">{{item.mobile}}</div>
          <div class="address">{{item.province}}{{item.city}}{{item.county}}{{item.address}}</div>
        </div>
        <div class="edit" @click="addAddress(item)">
          <img src="@/assets/image/edit.png" />
        </div>
      </div>
    </div>
    <div class="btn">
      <button @click="addAddress">+ 添加地址</button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import Header from '@/components/Header'
import { addressList, saveAddress } from '@/api/index'
export default {
  name: 'addressList',
  components: { Header },
  data() {
    return {
      title: '地址管理',
      address: []
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    document.title = '地址管理'
    this.addressList()
  },
  methods: {
    addressList() {
      addressList().then(res => {
        this.address = res.data
      })
    },
    addAddress(item) {
      this.$router.push({
        path: '/editAddress',
        query: {
          id: item ? item.id : ''
        }
      })
    },
    chooseAddress(item) {
      saveAddress({
        id: item.id,
        city: item.city,
        mobile: item.mobile,
        address: item.address,
        recipient: item.recipient,
        defaultAddress: true
      }).then(res => {
        Toast({
          message: '已设置为默认',
          position: 'middle',
          duration: 2000
        })
        this.addressList()
      })
    }
  }
}
</script>

<style lang="less">
.addressList-container {
  background: #f7f7f7;
  min-height: 100vh;
  .address-box {
    padding: 0 0.94rem;
    .list {
      background: #fff;
      border-radius: 0.5rem;
      display: flex;
      padding: 0.72rem;
      margin-top: 0.94rem;
      align-items: center;
      .info {
        flex: 1;
        margin: 0 1.31rem;
      }
      .name,
      .phone {
        font-size: 0.88rem;
        color: #333333;
      }
      .address {
        font-size: 0.81rem;
        color: #888888;
        line-height: 1.19rem;
        margin-top: 0.53rem;
      }
      .edit img {
        width: 1.13rem;
        height: 1.13rem;
      }
      .default {
        border: 0.04rem solid #0085FE;
        color: #0085FE;
        border-radius: 0.16rem;
        font-size: 0.63rem;
        width: 1.8rem;
        height: 0.94rem;
        text-align: center;
        line-height: 0.94rem;
        margin-top: 0.53rem;
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 0;
    padding: 0.94rem;
    left: 0;
    right: 0;
    button {
      height: 2.75rem;
      width: 100%;
      border-radius: 0.31rem;
      font-size: 1.13rem;
      color: #333333;
      background: #ffffff;
      border: 0.03rem solid #dfdfdf;
      outline: none;
    }
  }
}
</style>
