<template>
  <div class="container">
    <div class="serchInput">
      <div class="search">
        <img src="@/assets/image/search.png" />
        <input
          v-reset-page
          type="search"
          @keyup.13="search()"
          placeholder="输入商品名称"
          v-model="keyword"
        />
      </div>
    </div>
    <div class="search-box">
      <swiper
        class="swiper"
        height="13.60rem"
        :show-desc-mask="false"
        dots-position="center"
        dots-class="dot"
      >
        <swiper-item v-for="(item, index) in banner_list" :key="index">
          <img :src="item.image" />
        </swiper-item>
      </swiper>
      <div class="notice">
        <img src="@/assets/image/notice.png" alt />
        <div class="swiper-notice">
          <swiper
            class="swiper"
            height="2.19rem"
            :show-desc-mask="false"
            :show-dots="false"
            auto
            :interval="2000"
          >
            <swiper-item v-for="(item, index) in bulletin_list" :key="index">
              <div class="content">{{item.content}}</div>
            </swiper-item>
          </swiper>
        </div>
      </div>
    </div>
    <div class="holder" style="height:18.79rem"></div>
    <div class="page-loadmore-wrapper">
      <mt-loadmore
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        :autoFill="false"
        ref="loadmore"
      >
      <!-- 免费兑换的商品由此开始 -->
        <div class="shop-list">
          <div class="title">
            <span class="line"></span>
            <span>免费领取</span>
          </div>
          <div class="list">  <!--商品罗列-->
            <div v-for="(item,index) in cargo_list" :key="index">
            <div class="goods"
              @click="goDetail(item.id)" v-if="item.iscard == 1"
            >
              <div>
                <img :src="item.picture" />
              </div>
              <div style="flex:1">
                <div class="am-line-1">{{item.name}}</div>
                <div class="sale">已兑换 {{item.saleNum}} 件 <span
                      style="text-decoration:line-through;margin-left:0.5rem"
                    >原价：￥{{item.originalPrice}}</span></div>
                <div class="buy">
                  <div>
                    <span style="color:#E64340;font-size:1rem;">❤</span>
                    <span style="font-size:1.44rem;color:#E64340;">{{item.point}}</span>
                    <span style="font-size:1.44rem;">+</span>
                    <span style="font-size:0.88rem;color:#E64340;">¥</span>
                    <span style="font-size:1.44rem;color:#E64340;">{{item.salePrice}}</span>
                    <!-- <span
                      style="text-decoration:line-through;margin-left:0.5rem"
                    >￥{{item.originalPrice}}</span> -->
                  </div>
                  <div class="btn">免费领取</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        <!-- 免费兑换的商品由此结束 -->

        <!-- 非免费兑换的商品由此开始 -->
        <div class="shop-list">
          <div class="title">
            <span class="line"></span>
            <span>兑换商品</span>
          </div>
          <div class="list">  <!--商品罗列-->
            <div v-for="(item,index) in cargo_list" :key="index">
            <div class="goods"
              @click="goDetail(item.id)" v-if="item.iscard == 0"
            >
              <div>
                <img :src="item.picture" />
              </div>
              <div style="flex:1">
                <div class="am-line-1">{{item.name}}</div>
                <div class="sale">已兑换 {{item.saleNum}} 件 <span
                      style="text-decoration:line-through;margin-left:0.5rem"
                    >原价：￥{{item.originalPrice}}</span></div>
                <div class="buy">
                  <div>
                    <span style="color:#E64340;font-size:1.2rem;">❤</span>
                    <span style="font-size:1.44rem;color:#E64340;">{{item.point}}</span>
                    <span style="font-size:1.44rem;">+</span>
                    <span style="font-size:1.2rem;color:#E64340;">¥</span>
                    <span style="font-size:1.44rem;color:#E64340;">{{item.salePrice}}</span>
                  </div>
                  <div class="btn">兑换</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        <!-- 非免费兑换的商品由此结束 -->
      </mt-loadmore>
      <div class="loadmore" v-if="cargo_list.length&&!allLoaded">
        <div>上拉加载更多</div>
      </div>
      <div class="loadmore" v-if="cargo_list.length&&allLoaded">
        <div>已经最底线了</div>
      </div>
      <div class="advertising">
        <img src="@/assets/image/advertising.png" />
      </div>
    </div>
    <div class="footer">
      <router-link to="/index" class="item">
        <div>
          <img src="@/assets/image/mall-normal.png" />
        </div>
        <div>商城</div>
      </router-link>
      <router-link to="order" class="item">
        <div>
          <img src="@/assets/image/order-normal.png" />
        </div>
        <div>订单</div>
      </router-link>

      <!--        新增-->
    <div class="item active">
        <div>
          <img src="@/assets/image/icon003.png" />
        </div>
        <div>安心城</div>
    </div>

      <router-link to="/bargaining" class="item">
        <div>
          <img src="@/assets/image/bargaining-normal.png" />
        </div>
        <div>砍价</div>
      </router-link>
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
    import { banner, bulletin, credit } from '@/api/index'
    import { Loadmore, Indicator } from 'mint-ui'
    import Header from '@/components/Header'
    import { Swiper, SwiperItem } from 'vux'
    export default {
        name: 'index',
        components: { Header, Swiper, SwiperItem, Loadmore },
        data() {
            return {
                page: '1',
                limit: 20,
                keyword: '',
                banner_list: [],
                bulletin_list: [],
                cargo_list: [],
                allLoaded: true,
                totalPage: ''
            }
        },
        created() {
            this.banner()
            this.bulletin()
            this.credit()
        },
        mounted() {
            document.title = '安纹智能商城'
        },
        methods: {
            banner() {
                banner().then(res => {
                    this.banner_list = res.data
                })
            },
            bulletin() {
                bulletin().then(res => {
                    this.bulletin_list = res.data
                })
            },
            credit() {
                let vm = this;
                Indicator.open({
                    text: 'Loading...',
                    spinnerType: 'fading-circle'
                })
                credit({
                    page: vm.page,
                    limit: vm.limit,
                    keyword: vm.keyword
                }).then(res => {
                    Indicator.close()
                    this.cargo_list = res.data
                    vm.totalPage = res.total
                    if (vm.page < vm.totalPage) {
                        vm.allLoaded = false
                    }
                })
            },
            goDetail(id) {
              this.$router.push({
                  path: '/creditDetail',
                  query: {
                      id: id
                  }
              })
            },
            loadBottom() {
                let vm = this
                vm.page++;
                credit({
                    page: vm.page,
                    limit: vm.limit,
                    keyword: vm.keyword
                }).then(res => {
                    let newlist = res.data;
                    vm.cargo_list = vm.cargo_list.concat(newlist)
                    this.$refs.loadmore.onBottomLoaded()
                    if (vm.page < vm.totalPage) {
                        vm.allLoaded = false
                    } else {
                        vm.allLoaded = true
                    }
                })
            },
            search() {
                let vm = this;
                Indicator.open({
                    text: 'Loading...',
                    spinnerType: 'fading-circle'
                })
                vm.page = 1
                vm.allLoaded = true
                credit({
                    page: vm.page,
                    limit: vm.limit,
                    keyword: vm.keyword
                }).then(res => {
                    Indicator.close()
                    this.cargo_list = res.data
                    vm.totalPage = res.total
                    if (vm.page < vm.totalPage) {
                        vm.allLoaded = false
                    }
                })
            }
        }
    }
</script>

<style lang="less">
  .container {
    min-height: 100vh;
    background: #f7f7f7;
    .serchInput {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #0095fe;
      height: 3rem;
      display: flex;
      align-items: center;
      padding: 0.31rem 0.63rem;
      box-sizing: border-box;
      .search {
        background: #ffffff;
        z-index: 999;
        display: flex;
        align-items: center;
        height: 1.88rem;
        border-radius: 0.94rem;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        padding: 0 1rem;
        input {
          flex: 1;
          border: none;
          outline: none;
          height: 1.88rem;
          line-height: 1.88rem;
          border-radius: 0.94rem;
          font-size: 0.81rem;
          color: #666;
          text-indent: 0.31rem;
        }
        input::placeholder {
          font-size: 0.81rem;
          color: #a9a9a9;
        }
        img {
          width: 1.25rem;
          height: 1.25rem;
        }
      }
    }
    .search-box {
      position: fixed;
      top: 3rem;
      width: 100%;
      z-index: 999;
      .swiper {
        width: 100%;
        margin-top: -0.1rem;
        .vux-slider > .vux-indicator-center {
          bottom: 0.5rem !important;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .dot {
      bottom: 0 !important;
    }
    .vux-slider > .vux-indicator > a > .vux-icon-dot,
    .vux-slider .vux-indicator-right > a > .vux-icon-dot {
      background-color: #ffffff !important;
      width: 0.25rem !important;
      height: 0.25rem !important;
    }
    .vux-slider > .vux-indicator > a > .vux-icon-dot.active,
    .vux-slider .vux-indicator-right > a > .vux-icon-dot.active {
      background-color: #ffb780 !important;
      width: 00.81rem !important;
      height: 0.25rem !important;
    }
    .notice {
      display: flex;
      align-items: center;
      background: #fff;
      height: 2.19rem;
      padding: 0 0.88rem;
      .swiper-notice {
        font-size: 0.81rem;
        color: #262626;
        margin-left: 1.22rem;
        flex: 1;
        .content {
          line-height: 2.19rem;
        }
      }
      img {
        width: 1.25rem;
        height: 1.25rem;
      }
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
    .shop-list {
      padding: 0 0.94rem;
      .title {
        margin-top: 1.25rem;

        display: flex;
        font-size: 0.94rem;
        color: #333;
        align-items: center;
        .line {
          width: 0.19rem;
          height: 0.88rem;
          background: #F56C6C;
          margin-right: 0.47rem;
        }
      }
      .goods {
        display: flex;
        align-items: center;
        background: #fff;
        margin-top: 0.75rem;
        border-radius: 0.31rem;
        padding: 0.78rem 0.63rem;
        font-size: 0.87rem;
        color: #000000;
        img {
          width: 5rem;
          height: 5rem;
          margin-right: 0.84rem;
        }
        .sale {
          font-size: 0.75rem;
          color: #a9a9a9;
        }
        .buy {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #a9a9a9;
          .btn {
            font-size: 0.75rem;
            color: #fff;
            background: linear-gradient(to right, #0095fe, #0066fe);
            border-radius: 0.63rem;
            width: 3.75rem;
            height: 1.25rem;
            text-align: center;
            line-height: 1.25rem;
          }
        }
      }
    }
    .advertising {
      padding: 0rem 0.94rem 4.22rem 0.94rem;
      img {
        width: 100%;
        height: 5rem;
        border-radius: 0.31rem;
      }
    }
    .page-loadmore-wrapper {
      height: calc(100vh - 15.79rem);
    }
  }
</style>
