<template>
  <div class="qrCode-container">
    <Header :title="title" class="header"></Header>
    <div class="canvas">
      <img :src="ticket" @click="preview" />
    </div>
    <div class="prompt">点击图片分享给好友</div>
    <div class="model animated fadeIn" v-if="modelStatus" @click="closeModel">
      <img :src="ticket" />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { agentCenter, qrCode } from '@/api/index'
import { Indicator } from 'mint-ui'
export default {
  name: 'qrCode',
  components: { Header },
  data() {
    return {
      title: '二维码',
      ticket: '',
      modelStatus: false
    }
  },
  created() {
    this.agentCenter();
  },
  mounted() {
    document.title = '二维码'
  },
  methods: {
    agentCenter() {
      let vm = this
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      agentCenter().then(res => {
        qrCode({
          url: `https://aw.wisehuitong.com/posters?parentMemberId=${res.data.memberId}`
        }).then(result => {
          vm.ticket = result.data
          Indicator.close()
        })
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
