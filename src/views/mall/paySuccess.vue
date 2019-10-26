<template>
  <div class="paySuccess-container">
    <div class="option">
      <div class="icon">
        <img src="@/assets/image/success.png" alt />
        <div>购买成功</div>
      </div>
      <div class="btn">
        <button @click="goMall">返回商城</button>
        <button @click="goOrder">查看我的订单</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'paySuccess',
  components: {},
  data() {
    return {
      title: '购买成功'
    }
  },
  created() {
  },
  mounted() {
    document.title = '购买成功'
  },
  methods: {
    goMall() {
      this.$router.push('/index')
    },
    goOrder() {
      this.$router.push('/order')
    }
  }
}
</script>

<style lang="less" scoped>
.paySuccess-container {
  min-height: 100vh;
  background: #f7f7f7;
  z-index: 9999;
  position: absolute;
  top: 0;
  width: 100%;
  .option {
    padding: 0 0.94rem;
    .icon {
      font-size: 1.16rem;
      color: #333333;
      text-align: center;
      margin-top: 5.32rem;
      margin-bottom: 4.28rem;
      img {
        width: 5rem;
        height: 5rem;
        margin-bottom: 0.75rem;
      }
    }
    .btn {
      button {
        font-size: 1.06rem;
        color: #ffffff;
        background: linear-gradient(to right, #0095FE, #0066FE);
        height: 2.75rem;
        line-height: 2.75rem;
        border-radius: 0.31rem;
        border: none;
        outline: none;
        width: 100%;
        margin-bottom: 1rem;
      }
      button:nth-of-type(2) {
        background: transparent;
        border: 0.04rem solid #cfcfcf;
        color: #333333;
      }
    }
  }
}
</style>
