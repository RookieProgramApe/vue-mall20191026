<template>
  <div class="about-container">
    <Header :title="title"></Header>
    <div>
      <div class="tab">
        <tab custom-bar-width="3.75rem" bar-active-color="#0085FE" active-color="#0085FE">
          <tab-item selected @on-item-click="onItemClick">公司简介</tab-item>
          <tab-item @on-item-click="onItemClick">企业文化</tab-item>
          <tab-item @on-item-click="onItemClick">荣誉证书</tab-item>
        </tab>
      </div>
      <div class="about-text">
        <div v-html="introduction" v-show="activeIndex=='0'"></div>
        <div v-html="culture" v-show="activeIndex=='1'"></div>
        <div v-html="certificate" v-show="activeIndex=='2'"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { about } from '@/api/index'
import { Tab, TabItem } from 'vux'
export default {
  name: 'about',
  components: { Header, Tab, TabItem },
  data() {
    return {
      title: '关于我们',
      certificate: '',
      culture: '',
      introduction: '',
      activeIndex: 0
    }
  },
  created() {
  },
  mounted() {
    document.title = '关于我们'
    this.about()
  },
  methods: {
    onItemClick(index) {
      this.activeIndex = index
    },
    about() {
      about().then(res => {
        this.culture = res.data.culture
        this.certificate = res.data.certificate
        this.introduction = res.data.introduction
      })
    }
  }
}
</script>

<style lang="less">
.about-container {
  background: #f7f7f7;
  min-height: 100vh;
  .tab {
    position: fixed;
    top: 3rem;
    width: 100%;
    z-index: 999;
  }
  .vux-tab .vux-tab-item {
    font-size: 0.94rem;
    color: #262626;
    background: #fff;
    height: 2.72rem !important;
  }
  .about-text {
    font-size: 0.94rem;
    color: #262626;
    line-height: 1.78rem;
    padding: 0.94rem;
    padding-top: 2.72rem;
    text-align: justify;
    overflow-x: hidden;
    font-size: 0.81rem;
    img {
      width: 100% !important;
    }
  }
}
</style>
