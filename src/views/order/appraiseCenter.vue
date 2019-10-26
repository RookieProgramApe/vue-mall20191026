<template>
  <!-- 评价页面 -->
  <div class="paySuccess-container">
    评价中心
  </div>
</template>

<script>
import Header from '@/components/Header'
import { saveAppraise, detail, myInfo } from '@/api/index'
export default {
  name: 'paySuccess',
  components: { Header },
  data() {
    return {
      title: '评价晒单',
      star: [
          {checked: true},
          {checked: true},
          {checked: true},
          {checked: true},
          {checked: true}
      ],
      describe: '',
      cargoId: '',
      memberId: '',
      orderId: '',
      cargo: {}
    }
  },
  created() {
    // this.cargoId = this.$route.query.cargoId;
    // this.memberId = this.$route.query.memberId;
    // this.orderId = this.$route.query.orderId;
    // this.myInfo();
    // this.getCargoDetail();
  },
  mounted() {
    document.title = '评价晒单'
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
    saveAppraise() {
        let star = 0;
        let vm = this;
        this.star.forEach(item => {
            if (item.checked) {
                star++;
            }
        });

        saveAppraise({
          star: star,
          remark: vm.describe,
          // cargoId: vm.cargoId,
          // orderId: vm.orderId,
          // memberId: vm.memberId
          cargoId: 'ef368073961f48ef74b84db847809f40',
          orderId: '287e7de388a6ccb15f3790239d23c9f7',
          memberId: '5d983f0cbf7801dca97f29744ff1d8ce'
        }).then(res => {
          if (res.code === 200) {
            alert('评价成功！');
            vm.router.push('/appraiseCenter');
          } else {

          }
        })
    },
    getCargoDetail() {
      detail({
        id: this.cargoId
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
