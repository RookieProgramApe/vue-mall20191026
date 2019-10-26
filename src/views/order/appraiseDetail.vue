<template>
  <!-- 评价页面 -->
  <div class="paySuccess-container">
    <div style="position:relative;">
        <Header :title="title"></Header>
    </div>
    <div class="contents">
      <!-- 商品信息 -->
      <div style="padding: 0.5rem; background: #FFF; font-size: 1.22rem;" @click="seeCargoDetail">
        <img style="width:2.6rem; float: left;" :src="appraise.cargoImg" />
        <div style="float: left; padding-left: 0.5rem;">
          <div>{{appraise.cargoName}}</div>
        </div><br><br>
      </div>
      <!-- <div style="height: 0.1rem;"></div> -->
      <div style="padding: 0.5rem; margin-top: 0.6rem; background: #FFF;">
        <img v-if="appraise.memberAvatar" style="width:2.6rem; float: left;" :src="appraise.memberAvatar" />
        <img v-else style="width:2.8rem; float: left;" src="@/assets/image/peisong.jpg" />
        <div style="float: left; padding-left: 0.5rem; font-size: 1rem; margin-top: -0.25rem;">
          <div v-if="appraise.memberName">{{appraise.memberName}}</div>
          <div v-else>一位没有名字的用户</div>
          <div>
            <span v-for="count in appraise.star" :key="count">
              <img width="15rem" src="@/assets/image/star01.png"/>
            </span>
            <span v-for="count in 5-appraise.star" :key="count">
              <img width="15rem" src="@/assets/image/star02.png"/>
            </span>
          </div>
        </div><br><br>
        <div style="font-size: 1rem;">
          {{appraise.remark}}
        </div>
        <div style="margin-top: 0.5rem; font-size: 1rem;">
          <span style="color: #606266;" v-show="appraise.skuName">{{appraise.skuName}}</span>
          <span style="color: #606266;" v-show="appraise.skuName && appraise.cateName"> | </span>
          <span style="color: #606266;" v-show="appraise.cateName">{{appraise.cateName}}</span>
          <span style="color: #606266;" v-show="!appraise.skuName && !appraise.cateName">暂无规格</span>
          <span style="color: #909399; float: right;">{{appraise.createTime}}</span>
        </div>
      </div>
      <!-- <div v-if="appraiseList.length != 0"  style="text-align: center; padding-top: 0.5rem;">
        <span style="padding: 0.3rem; color: #606266; border: 0.08rem solid #606266; border-radius: 1.15rem;" @click="seeAll">查看全部评价</span>
      </div> -->
    </div>
    <!-- <div style="padding: 1rem; background: #fff; display: flex;align-items: center;">
        回复
    </div> -->
    <!-- <div style="height: 0.1rem;"></div> -->
    <!-- 回复信息 -->
    <div style="padding: 0.5rem; background: #FFF; font-size: 1.22rem; min-height: 20rem; margin-top: 0.6rem;">
      <div style="width: 0.2rem; height: 1.44rem; background: #F56C6C; margin-right: 0.5rem; float: left;"></div>
      <div style="font-size: 1rem; float: left;">回复</div>
      <div style="height: 0.1rem; background: #F2F6FC; margin-top: 1.8rem;"></div>
      <div style="text-align: center;">
        还没有人回复哦！
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { detail, myInfo, getAppraiseById, getMemberById } from '@/api/index'
export default {
  name: 'paySuccess',
  components: { Header },
  data() {
    return {
      title: '评价详情',
      star: [
          {checked: true},
          {checked: true},
          {checked: true},
          {checked: true},
          {checked: true}
      ],
      describe: '',
      cargoId: '',
      appraiseId: '',
      memberId: '',
      orderId: '',
      cargo: {},
      appraise: {},
      member: {}
    }
  },
  created() {
    this.appraiseId = this.$route.query.appraiseId;
    this.getAppraise();
  },
  mounted() {
    document.title = '评价详情'
  },
  methods: {
    // 获取用户信息
    myInfo() {
      myInfo().then(res => {
        this.memberId = res.data.id
      })
    },
    goMall() {
      this.$router.push('/index')
    },
    goOrder() {
      this.$router.push('/order')
    },
    goCargoDetail() {
      this.$router.push('/detail?id=f16db92bf6c7f8ba0e820f70c6ef9d42');
    },
    starClick(val) {
        this.star.forEach((item, index) => {
            if (index > val) {
                item.checked = false;
            } else {
                item.checked = true;
            }
        });
    },
    getCargoDetail(cargoId) {
      detail({
        id: cargoId
      }).then(res => {
        this.cargo = res.data
        // if (this.goodsInfo.mov) {
        //   this.type = 'video'
        // } else {
        //   this.type = 'image'
        // }
        // this.skuId = this.goodsInfo.sku[0].id
        // this.inventory = this.goodsInfo.sku[0].inventory
      })
    },
    getAppraise() {
        getAppraiseById({
            id: this.appraiseId
        }).then(res => {
            this.appraise = res.data;
            // this.getCargoDetail(res.data.cargoId);
            // this.getMemberById(res.data.memberId);
        });
    },
    getMemberById(memberId) {
        getMemberById({
            id: memberId
        }).then(res => {
            this.member = res.data;
        });
    },
    seeCargoDetail() {
      // 有规格则是商品
      if (this.appraise.skuName) {
        this.$router.push({
          path: '/detail',
          query: {
            id: this.appraise.cargoId
          }
        })
      } else {
        // 无规格积分兑换
        this.$router.push({
          path: '/creditDetail',
          query: {
            id: this.appraise.cargoId
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.paySuccess-container {
  min-height: 100vh;
  background: #f7f7f7;
  z-index: 9999;
  position: absolute;
  top: 0;
  width: 100%;
  .option {
    padding: 0.94rem;
    .icon {
      font-size: 1.16rem;
      color: #333333;
      text-align: center;
      margin-top: 5.32rem;
      margin-bottom: 4.28rem;
      img {
        width: 5rem;
        height: 5rem;
        margin-bottom: 0.75rem;
      }
    }
    .btn {
      button {
        font-size: 1.06rem;
        color: #ffffff;
        background: linear-gradient(to right, #0095FE, #0066FE);
        height: 2.75rem;
        line-height: 2.75rem;
        border-radius: 0.31rem;
        border: none;
        outline: none;
        width: 100%;
        margin-bottom: 1rem;
      }
      button:nth-of-type(2) {
        background: transparent;
        border: 0.04rem solid #cfcfcf;
        color: #333333;
      }
    }
  }
}
</style>
