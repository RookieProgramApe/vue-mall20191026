<template>
  <div class="posters-container">
    <div class="poster">
      <Header :title="title" v-if="!parentMemberId"></Header>
      <img :src="poster" alt />
    </div>
    <button @click="add">立即加入</button>
  </div>
</template>

<script>
import { getBill } from '@/api/index'
import Header from '@/components/Header'
export default {
  name: 'posters',
  components: { Header },
  data() {
    return {
      title: '欢迎加入',
      parentMemberId: '',
      poster: ''
    }
  },
  watch: {
  },
  created() {
    document.title = '加入合伙人'
    if (this.$route.query.parentMemberId) {
      this.parentMemberId = this.$route.query.parentMemberId
    }
    getBill().then(res => {
      this.poster = res.data
    })
  },
  mounted() {
  },
  methods: {
    add() {
      let vm = this
      this.$router.push({
        path: `/agentRegister`,
        query: {
          parentMemberId: vm.parentMemberId
        }
      })
    }
  }
}
</script>

<style lang="less">
.posters-container {
  background: #f7f7f7;
  min-height: 100vh;
  .poster {
    position: relative;
    padding-bottom: 2.5rem;
    img {
      width: 100%;
    }
  }
  button {
    position: fixed;
    bottom: 0%;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 1.06rem;
    color: #ffffff;
    border: none;
    width: 100%;
    background: linear-gradient(to right, #0095fe 60%, #0066fe);
  }
}
</style>
