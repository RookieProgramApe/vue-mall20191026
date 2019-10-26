<template>
  <div class="agentCenter-container page-loadmore-wrapper page-loadmore-top">
    <Header :title="title"></Header>
    <mt-loadmore :top-method="loadTop" :autoFill="true" ref="loadmore">
      <div class="agent-info">
        <img class="avatar" :src="agentInfo.avatar" />
        <div class="name">
          <span>你好，</span>
          <span>{{agentInfo.name}}</span>
        </div>
        <div class="auth" @click="auth">查看授权书</div>
        <router-link to="/information" class="information"></router-link>
        <div class="withdrawal">
          <div>
            <div>可提现(元)</div>
            <div class="carry">{{agentInfo.balance}}</div>
            <div>
              <span style="font-size:0.94rem;">累计收益:</span>
              <span style="color:#0097FF;font-size:0.94rem;">{{agentInfo.accruedIncome}}</span>
              <span style="font-size:0.94rem;">元</span>
            </div>
          </div>
          <div class="btn" @click="withdraw">申请提现</div>
        </div>
      </div>
      <div class="card-box">
        <router-link to="/card" class="item border-right border-bottom">
          <div>
            <img src="@/assets/image/card.png" />
          </div>
          <div>
            <p>我的卡片</p>
            <p>剩余{{agentInfo.giftcardCount}}张</p>
          </div>
        </router-link>
        <router-link to="/flow" class="item border-bottom">
          <div>
            <img src="@/assets/image/record.png" />
          </div>
          <div>
            <p>资金流水</p>
            <p>收入明细</p>
          </div>
        </router-link>
        <router-link to="/team" class="item border-right">
          <div>
            <img src="@/assets/image/team.png" />
          </div>
          <div>
            <p>我的团队</p>
            <p style="font-size:0.69rem">直属<span style="color:#E64340;">{{agentInfo.subordinateCount}}</span>人</p>
            <p style="font-size:0.69rem">次属<span style="color:#E64340;">{{agentInfo.dinateCount}}</span>人</p>
          </div>
        </router-link>
        <router-link to="qrCode" class="item">
          <div>
            <img src="@/assets/image/qrCode.png" />
          </div>
          <div>
            <p>二维码</p>
            <p>邀请合伙人</p>
          </div>
        </router-link>
      </div>
    </mt-loadmore>
  </div>
</template>

<script>
import { Loadmore } from 'mint-ui'
import Header from '@/components/Header'
import { agentCenter } from '@/api/index'
export default {
  name: 'agentCenter',
  components: { Header, Loadmore },
  data() {
    return {
      title: '合伙人中心',
      agentInfo: ''
    }
  },
  watch: {
  },
  created() {
    this.agentCenter();
  },
  mounted() {
    document.title = '合伙人中心'
  },
  methods: {
    agentCenter() {
      agentCenter().then(res => {
        this.agentInfo = res.data
      })
    },
    withdraw() {
      this.$router.push({
        path: '/withdraw'
      })
    },
    loadTop() {
      agentCenter().then(res => {
        this.agentInfo = res.data
        setTimeout(() => {
          this.$refs.loadmore.onTopLoaded()
        }, 1000)
      })
    },
    auth() {
      this.$router.push({
        path: '/auth'
      })
    }
  }
}
</script>

<style lang="less">
.agentCenter-container {
  background: #f7f7f7;
  min-height: 100vh;
  .agent-info {
    height: 12.75rem;
    background: linear-gradient(to right, #0095fe 60%, #0066fe);
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 0.75rem;
    color: #fff;
    position: relative;
    padding-top: 1rem;
    z-index: 9;
    .avatar {
      width: 3.44rem;
      height: 3.44rem;
      border-radius: 50%;
      margin-bottom: 0.5rem;
    }
    .name {
      font-size: 0.94rem;
      color: #fff;
      span:nth-of-type(2) {
        color: #fff;
      }
    }
    .auth {
      background: linear-gradient(to right, #eecf71, #ddba51);
      height: 1.44rem;
      line-height: 1.44rem;
      width: 5.63rem;
      text-align: center;
      color: #ffffff;
      font-size: 0.75rem;
      border-radius: 0.72rem;
      margin-top: 1.19rem;
    }
    .information {
      position: absolute;
      right: 0;
      top: 1rem;
      height: 1.38rem;
      width: 4.69rem;
      background-image: url("../../assets/image/information.png");
      background-size: 100% 100%;
      overflow: hidden;
    }
    .withdrawal {
      position: absolute;
      background: #fff;
      left: 0.94rem;
      right: 0.94rem;
      z-index: 9999;
      bottom: -3.81rem;
      border-radius: 0.91rem;
      padding: 0.84rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #888888;
      font-size: 0.75rem;
      box-sizing: border-box;
      height: 6.25rem;
      .btn {
        color: #0097ff;
        font-size: 0.94rem;
      }
      .carry {
        font-size: 1.38rem;
        color: #333333;
      }
    }
  }
  .card-box {
    background: #fff;
    border-radius: 0.31rem;
    display: flex;
    flex-wrap: wrap;
    margin: 4.56rem 0.94rem 0 0.94rem;
    .item {
      width: 50%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 4.69rem;
      padding: 0.78rem 0.91rem;
      font-size: 0.94rem;
      color: #333333;
      img {
        width: 3.13rem;
        height: 3.13rem;
        margin-right: 1.03rem;
      }
      p {
        margin: 0;
      }
      p:nth-of-type(2) {
        font-size: 0.69rem;
        color: #888888;
      }
      p:nth-of-type(3) {
        font-size: 0.69rem;
        color: #888888;
      }
    }
  }
  .border-right {
    border-right: 0.03rem solid #efefef;
  }
  .border-bottom {
    border-bottom: 0.03rem solid #efefef;
  }
}
</style>
