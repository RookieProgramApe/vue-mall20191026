<template>
  <div class="card-container page-loadmore-wrapper page-loadmore-top">
    <Header :title="title"></Header>
    <mt-loadmore
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :autoFill="false"
      bottomPullText
      ref="loadmore"
    >
      <div class="cardData">
        <div class="title">剩余可用(张)</div>
        <div class="num">{{leftCount}}</div>
        <div class="use">
          <span>总量:</span>
          <span>{{totalCount}}</span>
          <span>/ 已用:</span>
          <span>{{usedCount}}</span>
        </div>
        <div>
          <button @click="buy">购买卡片</button>
        </div>
      </div>
      <div class="titles">
        <span class="line"></span>
        <span>购买记录</span>
      </div>
      <div class="card-recoed">
        <div class="list" v-for="(item,index) in list" :key="index">
          <div class="status">
            <div
              :class="item.status=='2'?'success':item.status=='3'?'fail':''"
            >{{(item.status=='1' || item.status=='4')?'待审核':item.status=='2'?'购买成功':'审核失败'}}</div>
            <div>{{item.totalPrice}}元</div>
          </div>
          <div class="date">
            <div>{{item.createTime}}</div>
            <div>数量: {{item.count}}套</div>
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
import { giftcard, cardOrderList } from '@/api/index'
export default {
  name: 'editAddress',
  components: { Header, Loadmore },
  data() {
    return {
      title: '我的卡片',
      leftCount: '',
      totalCount: '',
      usedCount: '',
      page: 1,
      limit: 20,
      list: [],
      allLoaded: true,
      totalPage: ''
    }
  },
  watch: {
  },
  created() {
    this.giftcard()
    this.cardOrderList()
  },
  mounted() {
    document.title = '我的卡片'
  },
  methods: {
    giftcard() {
      let vm = this
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      giftcard().then(res => {
        Indicator.close()
        vm.leftCount = res.data.leftCount
        vm.totalCount = res.data.totalCount
        vm.usedCount = res.data.usedCount
      })
    },
    buy() {
      this.$router.push('/buyCard')
    },
    cardOrderList() {
      let vm = this
      cardOrderList({
        page: vm.page,
        limit: vm.limit
      }).then(res => {
        vm.list = res.data;
        vm.totalPage = res.total
        if (vm.page < vm.totalPage) {
          vm.allLoaded = false
        }
      })
    },
    loadBottom() {
      let vm = this
      vm.page++;
      cardOrderList({
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
      this.page = 1
      vm.allLoaded = true
      cardOrderList({
        page: vm.page,
        limit: vm.limit
      }).then(res => {
        vm.list = res.data;
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
.card-container {
  background: #f7f7f7;
  min-height: 100vh;
  .cardData {
    background: linear-gradient(to right, #0095fe 60%, #0066fe);
    height: 9.13rem;
    display: flex;
    padding-top: 0.5rem;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    color: #fff;
    .title {
      font-size: 0.75rem;
      width: 100%;
      padding-left: 4.78rem;
    }
    .num {
      color: #ffffff;
      font-size: 2.06rem;
    }
    .use {
      font-size: 0.88rem;
      color: #ffffff;
    }
    button {
      background: #ffffff;
      width: 4.69rem;
      height: 1.56rem;
      border-radius: 0.78rem;
      font-size: 0.75rem;
      color: #0085fe;
      outline: none;
      border: none;
    }
  }
  .titles {
    display: flex;
    align-items: center;
    padding: 1.44rem 0 0.47rem 0.94rem;
    font-size: 0.94rem;
    color: #333333;
    .line {
      display: inline-block;
      width: 0.19rem;
      height: 0.88rem;
      background: #0089fe;
      margin-right: 0.47rem;
    }
  }
  .list {
    background: #fff;
    padding: 0.75rem 0.94rem 0.63rem 0.94rem;
    border-bottom: 0.03rem solid #f6f6f6;
    .status {
      display: flex;
      justify-content: space-between;
      font-size: 1.06rem;
      color: #333333;
      div:nth-of-type(2) {
        font-size: 0.94rem;
        color: #e64340;
      }
      .success {
        color: #009f1a;
      }
      .fail {
        color: #e64340;
      }
    }
    .date {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #a9a9a9;
      div:nth-of-type(2) {
        font-size: 0.75rem;
        color: #333333;
      }
    }
  }
  .empty {
    font-size: 0.75rem;
    color: #999;
    text-align: center;
    img {
      margin-top: 4rem;
      width: 12.5rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
