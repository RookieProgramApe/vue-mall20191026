<template>
  <div class="holder">
    <x-header :left-options="leftOptions" :title="title"></x-header>
  </div>
</template>
<script>
import { XHeader } from 'vux'
export default {
  name: 'Header',
  components: { XHeader },
  props: {
    title: {
      type: String
    }
  },
  data() {
    return {
      leftOptions: {
        backText: ''
      }
    }
  },
  methods: {
  }
}
</script>
<style lang="less">
.vux-header {
  background: linear-gradient(to right, #0095FE 60%, #0066FE);
  height: 3rem;
  padding: 0 1.5rem !important;
  position: fixed !important;
  top: 0 !important;
  left: 0;
  right: 0;
  z-index: 999;
}
.holder {
  height: 3rem;
  overflow: hidden;
}
.vux-header .vux-header-left {
  color: #fff;
  top: 1rem !important;
  left: 1rem !important;
}
.vux-header .vux-header-left .vux-header-back {
  color: #fff;
  font-size: 1rem;
}
.vux-header .vux-header-left .left-arrow:before {
  border: 0.1rem solid #fff !important;
  border-right: transparent !important;
  border-bottom: transparent !important;
}
.vux-header-title {
  height: 3rem !important;
  line-height: 3rem !important;
  flex: 1;
  font-size: 1rem !important;
}
</style>
