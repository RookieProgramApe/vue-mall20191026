<template>
  <div class="widthdraw-container page-loadmore-wrapper page-loadmore-top">
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
        <div>可提现(元)</div>
        <div class="widthdraw">{{withdrawable}}</div>
      </div>
      <div class="input-box">
        <input
          type="number"
          v-model="amount"
          :placeholder="withdraw_min"
          οnkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
          onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"
        />
        <button @click="withdrawPropose">提现</button>
      </div>
      <div class="prompt">
        <div>{{withdraw_note}}</div>
      </div>
      <div class="integral-list">
        <div class="title">
          <span class="line"></span>
          <span>提现记录</span>
        </div>
        <div class="list" v-for="(item,index) in list" :key="index">
          <div>
            <div class="label">
              <div>
                <span
                  :style="{color:item.status=='0'?'':item.status=='1'?'#009F1A':item.status=='99'?'#E64340':''}"
                >{{item.status=='0'?'审核中':item.status=='1'?'提现成功':item.status=='99'?'提现失败':''}}</span>
                <span
                  v-if="item.status=='0'||item.status=='1'"
                  style="font-size:0.94rem;color:#666"
                >(手续费{{item.commission}})</span>
              </div>
              <div style="color:#888888;font-size:0.75rem" v-if="item.comment">原因:{{item.comment}}</div>
            </div>
            <div class="date">{{item.createTime}}</div>
          </div>
          <div>
            <span class="money">-{{item.amount}}元</span>
          </div>
        </div>
      </div>
      <div class="empty" v-if="!list.length">
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
import { Loadmore, Indicator, MessageBox, Toast } from 'mint-ui'
import { withdraw, withdrawRecord, withdrawPropose } from '@/api/index'
import Header from '@/components/Header'
export default {
  name: 'widthdraw',
  components: { Header, Loadmore },
  data() {
    return {
      title: '提现中心',
      withdraw_note: '',
      withdrawable: '',
      withdraw_min: '',
      page: 1,
      limit: 20,
      list: [],
      allLoaded: true,
      totalPage: '',
      amount: ''
    }
  },
  created() {
    this.withdraw()
    this.withdrawRecord()
  },
  mounted() {
    document.title = '提现中心'
  },
  methods: {
    withdraw() {
      withdraw().then(res => {
        this.withdrawable = res.data.withdrawable
        this.withdraw_note = res.data.withdraw_note
        this.withdraw_min = `请输入提现金额，金额最低${res.data.withdraw_min}元`
      })
    },
    withdrawRecord() {
      let vm = this
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      })
      withdrawRecord({
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
      withdrawRecord({
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
    withdrawPropose() {
      let vm = this
      if (!vm.amount) {
        Toast('请输入提现金额')
        return false
      }
      MessageBox({
        title: '温馨提示',
        message: '您确定提现当前输入金额吗?',
        confirmButtonText: '确定',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          Indicator.open({
            text: 'Loading...',
            spinnerType: 'fading-circle'
          })
          withdrawPropose({
            amount: vm.amount
          }).then(result => {
            Indicator.close()
            if (result.code === 200) {
              Toast('提现成功')
              vm.page = 1
              vm.allLoaded = true
              vm.count = ''
              withdraw().then(res1 => {
                this.withdrawable = res1.data.withdrawable
                this.withdraw_note = res1.data.withdraw_note
                this.withdraw_min = `请输入提现金额，金额最低${res1.data.withdraw_min}元`
              })
              withdrawRecord({
                page: vm.page,
                limit: vm.limit
              }).then(res => {
                vm.list = res.data
                vm.totalPage = res.total
                if (vm.page < vm.totalPage) {
                  vm.allLoaded = false
                }
              })
            }
          })
        }
      })
    },
    loadTop() {
      let vm = this
      vm.page = 1
      vm.allLoaded = true
      withdrawRecord({
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

<style lang="less" scoped>
.widthdraw-container {
  background: #f7f7f7;
  min-height: 100vh;
  .integral-top {
    background: linear-gradient(to right, #0095fe 60%, #0066fe);
    color: #fff;
    font-size: 0.75rem;
    div {
      padding: 1.13rem 0.94rem;
    }
    .widthdraw {
      padding: 0;
      font-size: 2.06rem;
      padding-bottom: 1.63rem;
      text-align: center;
    }
  }
  .integral-list {
    background: #fff;
    .list {
      display: flex;
      justify-content: space-between;
      border-bottom: 0.03rem solid #f3f3f3;
      padding: 0.72rem 0.94rem;
      div {
        .label {
          font-size: 1.06rem;
          color: #333333;
        }
        .money {
          font-size: 0.94rem;
          color: #333333;
        }
        .date {
          font-size: 0.75rem;
          color: #a9a9a9;
        }
        .success {
          color: #009f1a;
        }
        .fail {
          color: #e64340;
        }
      }
    }
    .list:last-child {
      border-bottom: none;
    }
    .title {
      display: flex;
      align-items: center;
      height: 2.56rem;
      padding: 0 0.94rem;
      font-size: 0.94rem;
      border-bottom: 0.03rem solid #f3f3f3;
      color: #333333;
      .line {
        width: 0.19rem;
        height: 0.88rem;
        background: #0085fe;
        margin-right: 0.47rem;
      }
    }
  }
  .prompt {
    padding: 0.47rem 0.94rem 1.34rem 0.94rem;
    font-size: 0.63rem;
    color: #e64340;
    text-align: justify;
  }
  .input-box {
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0.91rem 0.94rem;
    input {
      outline: none;
      border: none;
      background: #eeeeee;
      border-radius: 0.31rem;
      flex: 1;
      height: 2.25rem;
      line-height: 2.25rem;
      text-indent: 1rem;
      font-size: 0.81rem;
      color: #bfbfbf;
    }
    input:placeholder {
      font-size: 0.81rem;
      color: #bfbfbf;
    }
    button {
      height: 2.25rem;
      line-height: 2.25rem;
      width: 4.06rem;
      border: none;
      background: linear-gradient(to right, #0095fe, #0066fe);
      font-size: 1.13rem;
      color: #fff;
      margin-left: 0.44rem;
      border-radius: 0.31rem;
    }
  }
  .empty {
    font-size: 0.75rem;
    color: #999;
    text-align: center;
    padding-top: 5rem;
  }
}
</style>
