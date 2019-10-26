<template>
  <div class="team-container page-loadmore-wrapper page-loadmore-top">
    <Header :title="title"></Header>
    <mt-loadmore
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :autoFill="false"
      bottomPullText
      ref="loadmore"
    >
      <div class="team-box">
        <div class="team" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
          <div>
            <p>
              <label>成员姓名：</label>
              <span>{{item.name}}</span>
            </p>
            <p>
              <label>直属人数：</label>
              <span>{{item.teamcount}}</span>
            </p>
            <p>
              <label>次属人数：</label>
              <span>{{item.dinateCount}}</span>
            </p>
            <p>
              <label>注册手机：</label>
              <span>{{item.phone}}</span>
            </p>
            <p>
              <label>累计购卡：</label>
              <span>{{item.bought}}套</span>
            </p>
            <p>
              <label>加入时间：</label>
              <span>{{item.create_time}}</span>
            </p>
          </div>
        </div>
        <div class="empty" v-if="!list.length">
          <img src="@/assets/image/empty_02.png" />
          <div>暂未查询到记录</div>
        </div>
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
import { queryOtherSubordinate } from '@/api/index'
export default {
  name: 'team',
  components: { Header, Loadmore },
  data() {
    return {
      memberId: '',
      title: '我的团队',
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
    this.memberId = this.$route.query.memberId
    this.title = `${this.$route.query.name}的团队`
  },
  mounted() {
    this.queryOtherSubordinate()
    document.title = this.title
  },
  methods: {
    queryOtherSubordinate() {
      let vm = this
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      queryOtherSubordinate({
        memberId: vm.memberId,
        page: vm.page,
        limit: vm.limit
      }).then(res => {
        Indicator.close()
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
      queryOtherSubordinate({
        memberId: vm.memberId,
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
      queryOtherSubordinate({
        page: vm.page,
        memberId: vm.memberId,
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
.team-container {
  background: #f7f7f7;
  min-height: 100vh;
  .team-box {
    padding: 0 0.94rem;
    .team {
      background: #fff;
      font-size: 0.75rem;
      color: #888888;
      padding: 0.72rem 0.75rem;
      border-radius: 0.31rem;
      margin-top: 0.91rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        margin: 0;
        span {
          color: #333333;
        }
      }
      div:nth-of-type(1) {
        flex: 1;
      }
      img {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  }
  .empty {
    font-size: 0.75rem;
    color: #999;
    text-align: center;
    img {
      margin-top: 11.5rem;
      width: 12.5rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
