<template>
  <div class="express-container">
    <Header :title="title"></Header>
    <div class="express">
      <p>
        <span>物流公司：</span>
        {{deliveryProvider}}
      </p>
      <p>
        <span>物流单号：</span>
        {{orderNum}}
      </p>
    </div>
    <div class="timeline" v-if="process.length">
      <timeline>
        <div v-for="(item,index) in process" :key="index">
          <timeline-item>
            <p>{{item.upload_Time}}</p>
            <h4>{{item.processInfo}}</h4>
          </timeline-item>
        </div>
      </timeline>
    </div>
  </div>
</template>
<script>
import { findLogistics } from '@/api/index'
import Header from '@/components/Header'
import { Timeline, TimelineItem } from 'vux'
export default {
  name: 'express',
  components: {
    Header,
    Timeline,
    TimelineItem
  },
  data() {
    return {
      title: '物流跟踪',
      id: '',
      orderNum: '',
      process: [],
      deliveryProvider: ''
    }
  },
  created() {
    this.id = this.$route.query.id
    this.findLogistics()
  },
  updated() {
  },
  mounted() {
    document.title = '物流跟踪'
  },
  watch: {},
  methods: {
    findLogistics() {
      let vm = this
      findLogistics({
        id: vm.id
      }).then(res => {
        vm.orderNum = res.data.orderNum
        vm.process = res.data.process
        vm.deliveryProvider = res.data.deliveryProvider
      })
    }
  }
}
</script>
<style lang="less">
.express-container {
  min-height: 100vh;
  padding-bottom: 3.06rem;
  background: #f7f7f7;
  .express {
    background: #fff;
    padding: 0.78rem 0.94rem;
    p {
      margin: 0;
      font-size: 0.81rem;
      color: #333333;
      line-height: 1.5rem;
      span {
        color: #888;
      }
    }
  }
  .timeline {
    background: #fff;
    padding: 0.94rem;
    margin-top: 0.75rem;
  }
}
.vux-timeline {
  padding: 0 !important;
  p {
    margin: 0 !important;
    font-size: 0.69rem;
    color: #666666;
  }
  h4 {
    font-size: 0.81rem;
    color: #666666;
    margin: 0;
    font-weight: normal;
  }
  .vux-timeline-item-tail {
    background-color: #dfdfdf;
  }
  .vux-timeline-item-color {
    background-color: #dfdfdf;
  }
  .vux-timeline-item-content {
    padding: 0 0 1rem 2rem;
  }
  .vux-timeline-item-head-first {
    width: 6px;
    height: 6px;
    left: 3px;
    top: 5px;
  }
  .vux-timeline-item-head {
    width: 6px;
    height: 6px;
    left: 3px;
    top: 5px;
  }
}
</style>
