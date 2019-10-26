<template>
  <div class="bargaining-container page-loadmore-wrapper page-loadmore-top">
    <div class="nav">
      <tab
        :line-width="2"
        custom-bar-width="5rem"
        active-color="#0085FE"
        default-color="#262626"
        bar-active-color="#0085FE"
      >
        <tab-item :selected="tabIndex==1" @on-item-click="setTab('1')">
          <span>
            <img :src="tabIndex=='1'?img_1[0].img:img_1[1].img" />
          </span>
          <span>砍价商品</span>
        </tab-item>
        <tab-item :selected="tabIndex==2" @on-item-click="setTab('2')">
          <span>
            <img :src="tabIndex=='2'?img_2[0].img:img_2[1].img" />
          </span>
          <span>我的砍价</span>
        </tab-item>
      </tab>
    </div>
    <mt-loadmore
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :autoFill="false"
      bottomPullText
      ref="loadmore"
      style="min-height:calc(100vh - 3.06rem);padding-top: 2.8rem;"
    >
      <div class="bargaining">
        <div v-if="tabIndex==1">
          <div class="list" v-for="(item,index) in list" :key="index" @click="goBargain(item.id)">
            <div>
              <img :src="item.cargo.picture" />
            </div>
            <div class="info">
              <div class="name am-line-2">{{item.cargo.name}}</div>
              <div class="num">已有{{item.doIng}}人正在参与</div>
              <div class="share">
                <div>
                  <span>最低¥{{item.floorPrice}}</span>
                  <span
                    style="color:#A9A9A9;font-size:0.75rem;text-decoration: line-through;"
                  >￥{{item.originalPrice}}</span>
                </div>
                <button>去砍价</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="tabIndex==2">
          <div class="myList" v-for="(item,index) in list" :key="index" @click="goDetail(item.id)">
            <div class="title">
              <span>{{item.createTime}}</span>
              <span
                :class="{no: true,error:(item.status!='2'||item.status!='3')}"
              >{{item.status=='1'?'未完成':item.status=='2'?'已完成':item.status=='3'?'已购买':'未完成'}}</span>
            </div>
            <div class="list my">
              <div>
                <img :src="item.cargo.picture" />
              </div>
              <div class="info">
                <div class="name am-line-2">{{item.cargo.name}}</div>
                <div class="num">已砍{{item.ykCount}}次，剩余{{item.wkCount}}次</div>
                <div class="share">
                  <div>
                    <span>最低¥{{item.floorPrice}}</span>
                    <span
                      style="color:#A9A9A9;font-size:0.75rem;text-decoration: line-through;"
                    >￥{{item.originalPrice}}</span>
                  </div>
                  <button>查看订单</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="empty" v-if="showEmpty==2">
        <img src="@/assets/image/empty_02.png" />
        <span>暂无记录</span>
      </div>
      <div class="loadmore" v-if="list.length&&!allLoaded">
        <div>上拉加载更多</div>
      </div>
      <div class="loadmore" v-if="list.length&&allLoaded">
        <div>已经最底线了</div>
      </div>
    </mt-loadmore>
    <div class="footer">
      <router-link to="/index" class="item">
        <div>
          <img src="@/assets/image/mall-normal.png" />
        </div>
        <div>商城</div>
      </router-link>
      <router-link to="/order" class="item">
        <div>
          <img src="@/assets/image/order-normal.png" />
        </div>
        <div>订单</div>
      </router-link>

      <!--        新增-->
      <router-link to="/credit" class="item">
        <div>
          <img src="@/assets/image/icon002.png" />
        </div>
        <div>安心城</div>
      </router-link>

      <div class="item active">
        <div>
          <img src="@/assets/image/bargaining-active.png" />
        </div>
        <div>砍价</div>
      </div>
      <router-link to="/my" class="item">
        <div>
          <img src="@/assets/image/my-normal.png" />
        </div>
        <div>我的</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Loadmore, Indicator } from 'mint-ui'
import { Tab, TabItem } from 'vux'
import { Bargain, mylist } from '@/api/index'
export default {
  name: 'bargaining',
  components: { Tab, TabItem, Loadmore },
  data() {
    return {
      tabIndex: 1,
      img_1: [
        {
          img: require('@/assets/image/bargaining-on.png')
        },
        {
          img: require('@/assets/image/bargaining-un.png')
        }
      ],
      img_2: [
        {
          img: require('@/assets/image/myBargaining-on.png')
        },
        {
          img: require('@/assets/image/myBargaining-un.png')
        }
      ],
      page: '1',
      limit: 20,
      list: [],
      allLoaded: true,
      totalPage: '',
      showEmpty: ''
    }
  },
  created() {
    if (localStorage.getItem('tabIndex') === '2') {
      this.tabIndex = 2
      localStorage.removeItem('tabIndex')
      this.mylist()
    } else {
      this.Bargain()
    }
  },
  mounted() {
    document.title = '我的订单'
  },
  methods: {
    setTab(tabIndex) {
      this.showEmpty = ''
      this.tabIndex = tabIndex
      this.page = 1
      this.list = []
      this.allLoaded = true
      if (this.tabIndex === '1') {
        this.Bargain()
      } else {
        this.mylist()
      }
    },
    Bargain() {
      let vm = this
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      Bargain({
        page: vm.page,
        limit: vm.limit
      }).then(res => {
        Indicator.close()
        vm.list = res.data
        vm.totalPage = res.total
        if (vm.page < vm.totalPage) {
          vm.allLoaded = false
        }
        if (!this.list.length) {
          vm.showEmpty = 2
        } else {
          vm.showEmpty = 1
        }
      })
    },
    mylist() {
      let vm = this
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      mylist({
        page: vm.page,
        limit: vm.limit
      }).then(res => {
        Indicator.close()
        vm.list = res.data
        vm.totalPage = res.total
        if (vm.page < vm.totalPage) {
          vm.allLoaded = false
        }
        if (!this.list.length) {
          vm.showEmpty = 2
        } else {
          vm.showEmpty = 1
        }
      })
    },
    loadBottom() {
      let vm = this
      vm.page++;
      if (vm.tabIndex === 1) {
        Bargain({
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
      } else {
        mylist({
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
      }
    },
    goBargain(id) {
      this.$router.push({
        path: '/orderDetail',
        query: {
          id: id
        }
      })
    },
    goDetail(id) {
      localStorage.setItem('tabIndex', this.tabIndex)
      this.$router.push({
        path: '/myBargaining',
        query: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="less">
.bargaining-container {
  min-height: 100vh;
  padding-bottom: 3.06rem;
  background: #f7f7f7;
  .nav {
    height: 2.72rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
    overflow: hidden;
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    height: 3.06rem;
    font-size: 0.63rem;
    display: flex;
    align-items: center;
    .item {
      flex: 1;
      text-align: center;
    }
    a {
      color: #333333;
    }
    img {
      width: 1.38rem;
      height: 1.38rem;
    }
    .active {
      color: #0085fe;
    }
  }
  .vux-tab .vux-tab-item:nth-of-type(1) {
    border-right: 0.03rem solid #eeeeee !important;
  }
  .vux-tab .vux-tab-item {
    height: 2.72rem;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      vertical-align: middle;
      img {
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.19rem;
      }
    }
  }
  .bargaining {
    padding: 0.75rem 0.94rem;
    .list:nth-of-type(1),
    .myList:nth-of-type(1) {
      margin-top: 0;
    }
    .list {
      display: flex;
      align-items: flex-start;
      background: #fff;
      border-radius: 0.31rem;
      padding: 0.63rem;
      margin-top: 1rem;
      img {
        width: 5.31rem;
        height: 5.31rem;
      }
      .info {
        flex: 1;
        margin-left: 0.84rem;
      }
      .name {
        font-size: 0.81rem;
        color: #333333;
        margin-bottom: 0.88rem;
      }
      .num {
        font-size: 0.69rem;
        color: #888888;
        background: #eeeeee;
        border-radius: 0.56rem;
        width: 8.75rem;
        height: 1.19rem;
        line-height: 1.19rem;
        text-align: center;
        margin-bottom: 0.75rem;
      }
      .share {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.88rem;
        color: #e64340;
        button {
          width: 4.06rem;
          height: 1.38rem;
          border-radius: 0.31rem;
          background: #e64340;
          border: none;
          color: #fff;
          font-size: 0.75rem;
        }
      }
    }
    .myList {
      background: #fff;
      border-radius: 0.31rem;
      margin-top: 1rem;
      .title {
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.75rem;
        color: #333333;
        border-bottom: 0.03rem solid #eee;
        padding: 0 0.75rem;
      }
      .error {
        color: #e64340;
      }
      .my {
        border-radius: none;
        button {
          background: linear-gradient(to right, #0089fe, #0066fe) !important;
        }
      }
    }
  }
  .empty {
    position: relative;
    margin-top: 12.72rem;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
    color: #999;
    justify-content: center;
    align-items: center;
    padding-bottom: 2rem;
    img {
      width: 10.5rem;
      height: 7.5rem;
      margin-bottom: 1rem;
      margin-top: -3.36rem;
    }
  }
}
</style>
