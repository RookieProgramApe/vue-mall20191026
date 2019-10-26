<template>
  <div class="qrCode-container">
    <Header :title="title" class="header"></Header>
    <div class="canvas">
      <img :src="ticket" @click="preview" />
    </div>
    <div class="model animated fadeIn" v-if="modelStatus" @click="closeModel">
      <img :src="ticket" />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { getAuth } from '@/api/index'
import { Indicator } from 'mint-ui'
export default {
  name: 'auth',
  components: { Header },
  data() {
    return {
      title: '查看授权书',
      ticket: '',
      modelStatus: false
    }
  },
  created() {
    this.getAuth();
  },
  mounted() {
    document.title = '查看授权书'
  },
  methods: {
    getAuth() {
      let vm = this
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      getAuth().then(res => {
        vm.ticket = res.data
        Indicator.close()
      })
    },
    preview() {
      this.modelStatus = true
    },
    closeModel() {
      this.modelStatus = false
    }
  }
}
</script>

<style lang="less">
.qrCode-container {
  background: #f7f7f7;
  min-height: 100vh;
  .canvas {
    margin: 1.22rem 0.94rem;
    height: 31.25rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .prompt {
    font-size: 0.88rem;
    color: #888888;
    margin-top: 1.53rem;
    text-align: center;
  }
  .model {
    position: fixed;
    background: rgba(0, 0, 0, 1);
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
