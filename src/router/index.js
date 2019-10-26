import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const _import = require('./_import_' + process.env.NODE_ENV)

export const constantRouterMap = [
  {
    path: '/',
    component: _import('mall/index')
  },
  {
    path: '/index',
    component: _import('mall/index')
  },
  {
    path: '/detail',
    component: _import('mall/detail')
  },
  {
    path: '/order',
    component: _import('order/index')
  },
  {
    path: '/my',
    component: _import('my/index')
  },
  {
    path: '/integral',
    component: _import('my/integral')
  },
  {
    path: '/about',
    component: _import('my/about')
  },
  {
    path: '/editAddress',
    component: _import('my/editAddress')
  },
  {
    path: '/addressList',
    component: _import('my/addressList')
  },
  {
    path: '/agentRegister',
    component: _import('my/agentRegister')
  },
  {
    path: '/agentCenter',
    component: _import('my/agentCenter')
  },
  {
    path: '/information',
    component: _import('my/information')
  },
  {
    path: '/team',
    component: _import('my/team')
  },
  {
    path: '/flow',
    component: _import('my/moneyFlow')
  },
  {
    path: '/card',
    component: _import('my/card')
  },
  {
    path: '/buyCard',
    component: _import('my/buyCard'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/installation',
    component: _import('order/installation')
  },
  {
    path: '/qrCode',
    component: _import('my/qrCode')
  },
  {
    path: '/paySuccess',
    component: _import('mall/paySuccess')
  },
  {
    path: '/settlement',
    component: _import('mall/settlement'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/withdraw',
    component: _import('my/withdraw')
  },
  {
    path: '/posters',
    component: _import('my/posters')
  },
  {
    path: '/express',
    component: _import('order/express')
  },
  {
    path: '/auth',
    component: _import('my/auth')
  },
  {
    path: '/teamDetail',
    component: _import('my/teamDetail')
  },
  {
    path: '/bargaining',
    component: _import('bargaining/index')
  },
  {
    path: '/myBargaining',
    component: _import('bargaining/myBargaining')
  },
  {
    path: '/shareInter',
    component: _import('bargaining/shareInter')
  },
  {
    path: '/orderDetail',
    component: _import('bargaining/orderDetail')
  },
  {
    path: '/pay',
    component: _import('bargaining/pay'),
    meta: {
      keepAlive: true
    }
  },

  {
    path: '/credit',
    component: _import('credit/index')
  },
  {
    path: '/creditDetail',
    component: _import('credit/detail')
  },
  {
    path: '/creditPaySuccess',
    component: _import('credit/paySuccess')
  },
  {
    path: '/creditSettlement',
    component: _import('credit/settlement'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/appraiseCenter',
    component: _import('order/appraiseCenter')
  },
  {
    path: '/appraise',
    component: _import('order/appraise')
  },
  {
    path: '/appraiseDetail',
    component: _import('order/appraiseDetail')
  },
  {
    path: '/appraiseList',
    component: _import('credit/appraiseList')
  }

]

export default new Router({
  mode: 'history',
  routes: constantRouterMap,
  saveScrollPosition: true,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition && to.meta.keepAlive) {
      return savedPosition;
    }
    return {
      x: 0,
      y: 0
    };
  }
})
