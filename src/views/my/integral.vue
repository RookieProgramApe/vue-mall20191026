<template>
  <div class="integral-container page-loadmore-wrapper page-loadmore-top">
    <Header :title="title"></Header>
    <mt-loadmore
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :autoFill="false"
      bottomPullText
      ref="loadmore"
    >
      <div class="integral-top">
        <span>当前安心值：</span>
        <span>{{integral}}</span>
      </div>
      <div class="integral-list">
        <div class="list" v-for="(item,index) in list" :key="index">
          <div>
            <span class="label">{{item.title}}</span>
            <span class="integral" v-if="item.type=='1'"> + {{item.point}}</span>
            <span class="integral1" v-if="item.type!='1'"> - {{item.point}}</span>
          </div>
          <div>
            <span class="money">交易额：{{item.amount}}元</span>
            <span class="date">{{item.createTime}}</span>
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
import { Loadmore } from 'mint-ui'
import Header from '@/components/Header'
import { myCredit } from '@/api/index'
export default {
  name: 'integral',
  components: { Header, Loadmore },
  data() {
    return {
      title: '我的安心值',
      page: 1,
      integral: '',
      limit: 20,
      list: [],
      totalPage: '',
      allLoaded: true
    }
  },
  created() {
    this.integral = this.$route.query.integral
    this.myCredit();
  },
  mounted() {
    document.title = '我的安心值'
  },
  methods: {
    myCredit() {
      let vm = this
      myCredit({
        page: vm.page,
        limit: vm.limit
      }).then(res => {
        vm.list = res.data
        vm.totalPage = res.total
        if (vm.page < vm.totalPage) {
          vm.allLoaded = false
        }
      })
    },
    loadBottom() {
      let vm = this
      vm.page++;
      myCredit({
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
      myCredit({
        page: vm.page,
        limit: vm.limit
      }).then(res => {
        vm.list = res.data
        vm.totalPage = res.total
        if (vm.page < vm.totalPage) {
          vm.allLoaded = false
        }
        setTimeout(() => {
          this.$refs.loadmore.onTopLoaded()
        }, 1000)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.integral-container {
  background: #f7f7f7;
  min-height: 100vh;
  .integral-top {
    background: linear-gradient(to right, #0095fe 60%, #0066fe);
    height: 6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.75rem;
    span:nth-of-type(2) {
      font-size: 1.25rem;
      margin-left: 0.5rem;
    }
  }
  .integral-list {
    background: #fff;
    .list {
      border-bottom: 0.03rem solid #f3f3f3;
      padding: 0.81rem 0.94rem 0.78rem 0.91rem;
      div {
        display: flex;
        justify-content: space-between;
        .label {
          font-size: 1rem;
          color: #262626;
        }
        .integral {
          font-size: 0.94rem;
          color: #e64340;
        }
        .integral1 {
          font-size: 0.94rem;
          color: #67C23A;
        }
        .money {
          font-size: 0.75rem;
          color: #888888;
        }
        .date {
          font-size: 0.69rem;
          color: #a9a9a9;
        }
      }
    }
    .list:last-child {
      border-bottom: none;
    }
  }
  .empty {
    font-size: 0.75rem;
    color: #999;
    text-align: center;
    img {
      margin-top: 8.5rem;
      width: 12.5rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
