<template>
  <div class="flow-container page-loadmore-wrapper page-loadmore-top">
    <Header :title="title"></Header>
    <mt-loadmore
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :autoFill="false"
      bottomPullText
      ref="loadmore"
    >
      <div class="earnings">
        <div class="title">累计收益(元)</div>
        <div class="am-center">{{agentInfo.accruedIncome}}</div>
      </div>
      <div class="navbar">
        <div :class="type=='1'?'active':''" @click="chooseType('1')">卡片奖励</div>
        <div :class="type=='2'?'active':''" @click="chooseType('2')">提货佣金</div>
      </div>
      <div class="flow-record">
        <div class="list" v-for="(item,index) in list" :key="index">
          <div class="type">{{type=='1'?'卡片奖励':'提货佣金'}}</div>
          <div class="detail" v-if="type==2">
            <div class="sale">
              <p class="am-line-1">商品：{{item.cargoName}}</p>
              <p>销量：{{item.saleCount}}件</p>
              <p>销售额：{{item.totalPrice}}元</p>
            </div>
            <div class="earning">+{{item.drpAward}}元</div>
          </div>
          <div class="detail" v-if="type==1">
            <div class="sale">
              <p class="am-line-1">代理：{{item.name}} {{item.phone}}</p>
              <p>订单额：{{item.orderPrice}}元</p>
              <p>购入卡片：{{item.orderNum}}套</p>
            </div>
            <div class="earning">+{{item.amount}}元</div>
          </div>
        </div>
      </div>
      <div class="empty" v-if="!list.length">
        <img src="@/assets/image/empty_02.png" />
        <div>暂未查询到记录</div>
      </div>
      <div class="loadmore" v-if="list.length&&!allLoaded">
        <div>上拉加载更多</div>
      </div>
      <div class="loadmore" v-if="list.length&&allLoaded">
        <div>已经最底线了</div>
      </div>
    </mt-loadmore>
  </div>
</template>

<script>
import { Loadmore, Indicator } from 'mint-ui'
import Header from '@/components/Header'
import { agentCenter, finance } from '@/api/index'
export default {
  name: 'flow',
  components: { Header, Loadmore },
  data() {
    return {
      title: '资金流水',
      type: 1,
      page: 1,
      limit: 20,
      list: [],
      allLoaded: true,
      totalPage: '',
      agentInfo: ''
    }
  },
  watch: {
  },
  created() {
    this.agentCenter()
    this.finance();
  },
  mounted() {
    document.title = '资金流水'
  },
  methods: {
    agentCenter() {
      agentCenter().then(res => {
        this.agentInfo = res.data
      })
    },
    chooseType(type) {
      this.type = type
      this.list = []
      this.page = 1
      this.allLoaded = true
      this.finance()
    },
    finance() {
      let vm = this
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      finance({
        type: vm.type,
        page: vm.page,
        limit: vm.limit
      }).then(res => {
        vm.list = res.data
        Indicator.close()
        vm.totalPage = res.total
        if (vm.page < vm.totalPage) {
          vm.allLoaded = false
        }
      })
    },
    loadBottom() {
      let vm = this
      vm.page++;
      finance({
        type: vm.type,
        page: vm.page,
        limit: vm.limit
      }).then(res => {
        let newlist = res.data;
        vm.list = vm.list.concat(newlist)
        this.$refs.loadmore.onBottomLoaded()
        if (vm.page < vm.totalPage) {
          vm.allLoaded = false
        } else {
          vm.allLoaded = true
        }
      })
    },
    loadTop() {
      let vm = this
      vm.page = 1
      vm.allLoaded = true
      finance({
        type: vm.type,
        page: vm.page,
        limit: vm.limit
      }).then(res => {
        vm.list = res.data
        vm.totalPage = res.total
        if (vm.page < vm.totalPage) {
          vm.allLoaded = false
        }
        setTimeout(() => {
          vm.$refs.loadmore.onTopLoaded()
        }, 1000)
      })
    }
  }
}
</script>

<style lang="less">
.flow-container {
  background: #f7f7f7;
  min-height: 100vh;
  .earnings {
    height: 5.38rem;
    color: #ffffff;
    font-size: 2.06rem;
    padding-top: 0.5rem;
    background: linear-gradient(to right, #0095fe 60%, #0066fe);
    .title {
      color: #fff;
      font-size: 0.75rem;
      padding-left: 4.78rem;
    }
  }
  .navbar {
    padding: 0.75rem 0.94rem;
    box-sizing: border-box;
    display: flex;
    div {
      border: 0.04rem solid #0085fe;
      width: 4.69rem;
      height: 1.88rem;
      line-height: 1.88rem;
      text-align: center;
      font-size: 0.94rem;
      color: #0085fe;
      border-radius: 0.94rem;
      margin-right: 0.75rem;
    }
    .active {
      border: none;
      background: linear-gradient(to right, #0095fe 60%, #0066fe);
      color: #ffffff;
    }
  }
  .list {
    background: #fff;
    padding: 0 0.91rem;
    margin-bottom: 0.66rem;
    .type {
      height: 1.75rem;
      line-height: 1.75rem;
      font-size: 0.75rem;
      color: #333333;
      border-bottom: 0.03rem solid #f3f3f3;
    }
    .detail {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.69rem 0 0.88rem 0;
      .sale {
        flex: 1;
        font-size: 0.75rem;
        color: #888888;
        p {
          margin: 0;
        }
      }
    }
    .earning {
      color: #e64340;
    }
  }
  .empty {
    font-size: 0.75rem;
    color: #999;
    text-align: center;
    img {
      margin-top: 5.5rem;
      width: 12.5rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
