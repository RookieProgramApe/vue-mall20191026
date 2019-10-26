<template>
  <div class="detail-container">
    <Header :title="title"></Header>
    <!-- 评价由此开始 -->
    <div class="goods-detail" style="padding-bottom: 1rem;">
      <div class="title"> <span class="line">|</span> 全部评价 </div>
      <div class="contents1">
        <div v-for="(item, index) in appraiseList" :key="index" style="padding: 0.5rem; margin-top: 1rem;" @click="seeAppraiseDetail(item.id)">
          <img v-if="item.memberAvatar" style="width:2.6rem; float: left;" :src="item.memberAvatar" />
          <img v-else style="width:2.6rem; float: left;" src="@/assets/image/peisong.jpg" />
          <div style="float: left; padding-left: 0.5rem;">
            <div v-if="item.memberName">{{item.memberName}}</div>
            <div v-else>一位没有名字的用户</div>
            <div>
              <span v-for="count in item.star" :key="count">
                <img width="15rem" src="@/assets/image/star01.png"/>
              </span>
              <span v-for="count in 5-item.star" :key="count">
                <img width="15rem" src="@/assets/image/star02.png"/>
              </span>
            </div>
          </div><br><br>
          <div style="margin-top: 0.5rem; font-size: 1rem;">
            {{item.remark}}
          </div>
          <div style="margin-top: 0.5rem;">
            <span style="color: #606266;" v-show="item.skuName">{{item.skuName}}</span>
            <span style="color: #606266;" v-show="item.skuName && item.cateName"> | </span>
            <span style="color: #606266;" v-show="item.cateName">{{item.cateName}}</span>
            <span style="color: #606266;" v-show="!item.skuName && !item.cateName">暂无规格</span>
            <span style="color: #909399; float: right;">{{item.createTime}}</span>
          </div>
          <div style="height: 0.1rem; background: #F2F6FC; margin-top: 0.5rem;"></div>
        </div>
        <!-- <div v-if="appraiseList.length != 0"  style="text-align: center; padding-top: 0.5rem;">
          <span style="padding: 0.3rem; color: #606266; border: 0.08rem solid #606266; border-radius: 1.15rem;" @click="seeAll">查看全部评价</span>
        </div> -->
      </div>
    </div>
    <!-- 评价由此结束 -->
  </div>
</template>

<script>
import Header from '@/components/Header'
import { queryAppraiseByCargo } from '@/api/index'
export default {
  name: 'appraiseList',
  components: { Header },
  data() {
    return {
      title: '商品评价',
      appraiseList: [],
      id: ''
    }
  },
  computed: {
    // showTop: function () {
    //   return this.scrollTop > 700
    // }
  },
  created() {
    this.id = this.$route.query.cargoId;
    this.getAppraiseList(this.id);
  },
  mounted() {
    document.title = '商品评价'
  },
  methods: {
    getAppraiseList(id) {
      queryAppraiseByCargo({
        page: 1,
        limit: 20,
        id: id
      }).then(res => {
        this.appraiseList = res.data
      })
    },
    seeAppraiseDetail(id) {
        this.$router.push({
        path: '/appraiseDetail',
        query: {
          appraiseId: id
        }
      });
    }
  }
}
</script>
