import request from '@/utils/request'

export function banner() {
  return request({
    url: 'api/banner',
    method: 'post'
  })
}

export function about() {
  return request({
    url: 'api/about',
    method: 'post'
  })
}

export function bulletin() {
  return request({
    url: 'api/bulletin',
    method: 'post'
  })
}

export function cargo(data) {
  return request({
    url: 'api/cargo/all',
    method: 'post',
    params: data
  })
}


export function credit(data) {
  return request({
    url: 'api/credit/all',
    method: 'post',
    params: data
  })
}


export function mytype(data) {
  return request({
    url: 'api/cargo/type',
    method: 'post',
    params: data
  })
}


export function addressList(data) {
  return request({
    url: 'api/address/addressList',
    method: 'post',
    params: data
  })
}

export function deleteAddress(data) {
  return request({
    url: 'api/address/delete',
    method: 'post',
    params: data
  })
}

export function addressDetail(data) {
  return request({
    url: 'api/address/detail',
    method: 'post',
    params: data
  })
}

export function myAddress(data) {
  return request({
    url: 'api/address/myAddress',
    method: 'post',
    params: data
  })
}

export function saveAddress(data) {
  return request({
    url: 'api/address/save',
    method: 'post',
    params: data
  })
}

export function myInfo(data) {
  return request({
    url: 'api/member/myInfo',
    method: 'post',
    params: data
  })
}

export function join(data) {
  return request({
    url: 'api/retailer/join',
    method: 'post',
    params: data
  })
}

export function sendSms(data) {
  return request({
    url: 'api/sendSms',
    method: 'post',
    params: data
  })
}

export function getStatus(data) {
  return request({
    url: 'api/retailer/status',
    method: 'post',
    params: data
  })
}

export function agentCenter(data) {
  return request({
    url: 'api/retailer/center',
    method: 'post',
    params: data
  })
}

export function updateRetailerInfo(data) {
  return request({
    url: 'api/retailer/updateRetailerInfo',
    method: 'post',
    params: data
  })
}

export function giftcard(data) {
  return request({
    url: 'api/retailer/giftcard',
    method: 'post',
    params: data
  })
}

export function cardInfo(data) {
  return request({
    url: 'api/retailer/cardInfo',
    method: 'post',
    params: data
  })
}

export function buyCard(data) {
  return request({
    url: 'api/retailer/buyCard',
    method: 'post',
    params: data
  })
}

export function cardOrderList(data) {
  return request({
    url: 'api/retailer/cardOrderList',
    method: 'post',
    params: data
  })
}

export function subordinate(data) {
  return request({
    url: 'api/retailer/subordinate',
    method: 'post',
    params: data
  })
}

export function finance(data) {
  return request({
    url: 'api/retailer/finance',
    method: 'post',
    params: data
  })
}

export function qrCode(data) {
  return request({
    url: 'api/retailer/qr',
    method: 'post',
    params: data
  })
}

export function contact(data) {
  return request({
    url: 'api/contact',
    method: 'post',
    params: data
  })
}

export function sign(data) {
  return request({
    url: 'api/wx/sign',
    method: 'post',
    params: data
  })
}

export function login(data) {
  return request({
    url: 'api/wx/login',
    method: 'post',
    params: data
  })
}

export function detail(data) {
  return request({
    url: 'api/cargo/detail',
    method: 'post',
    params: data
  })
}

export function creditDetail(data) {
  return request({
    url: 'api/credit/detail',
    method: 'post',
    params: data
  })
}


export function getCredit(data) {
  return request({
    url: 'api/cargo/credit',
    method: 'post',
    params: data
  })
}

export function pay(data) {
  return request({
    url: 'api/cargo/pay',
    method: 'post',
    params: data
  })
}

export function creditPay(data) {
  return request({
    url: 'api/credit/pay',
    method: 'post',
    params: data
  })
}

export function order(data) {
  return request({
    url: `api/member/order/queryOrder`,
    method: 'post',
    params: data
  })
}

export function myCredit(data) {
  return request({
    url: `api/member/myCredit`,
    method: 'post',
    params: data
  })
}

export function withdraw(data) {
  return request({
    url: `api/retailer/withdraw`,
    method: 'post',
    params: data
  })
}

export function withdrawRecord(data) {
  return request({
    url: `api/retailer/withdrawRecord`,
    method: 'post',
    params: data
  })
}

export function withdrawPropose(data) {
  return request({
    url: `api/retailer/withdrawPropose`,
    method: 'post',
    params: data
  })
}

export function endOrder(data) {
  return request({
    url: `api/member/order/endOrder`,
    method: 'post',
    params: data
  })
}

export function orderByaz(data) {
  return request({
    url: `api/member/order/orderByaz`,
    method: 'post',
    params: data
  })
}

export function findLogistics(data) {
  return request({
    url: `api/member/order/findLogistics`,
    method: 'post',
    params: data
  })
}

export function getBill(data) {
  return request({
    url: `api/getBill`,
    method: 'post',
    params: data
  })
}

export function getAuth(data) {
  return request({
    url: `api/getAuth`,
    method: 'post',
    params: data
  })
}

export function queryOtherSubordinate(data) {
  return request({
    url: `api/retailer/queryOtherSubordinate`,
    method: 'post',
    params: data
  })
}

export function Bargain(data) {
  return request({
    url: `api/Bargain/list`,
    method: 'post',
    params: data
  })
}

export function mylist(data) {
  return request({
    url: 'api/Bargain/mylist',
    method: 'post',
    params: data
  })
}

export function orderDetail(data) {
  return request({
    url: 'api/Bargain/orderDetail',
    method: 'post',
    params: data
  })
}

export function bargainDetail(data) {
  return request({
    url: 'api/Bargain/detail',
    method: 'post',
    params: data
  })
}

export function addBargain(data) {
  return request({
    url: 'api/Bargain/add',
    method: 'post',
    params: data
  })
}

export function BargainingList(data) {
  return request({
    url: 'api/Bargain/BargainingList',
    method: 'post',
    params: data
  })
}

export function cut(data) {
  return request({
    url: 'api/Bargain/cut',
    method: 'post',
    params: data
  })
}

export function payByBargain(data) {
  return request({
    url: 'api/cargo/payByBargain',
    method: 'post',
    params: data
  })
}

export function addOrder(data) {
  return request({
    url: 'api/member/order/addOrder',
    method: 'post',
    params: data
  })
}

// 保存评论
export function saveAppraise(data) {
  return request({
    url: 'api/appraise/save',
    method: 'post',
    params: data
  })
}

// 根据订单id获取评价
export function getAppraiseByOrderId(data) {
  return request({
    url: 'api/appraise/getByOrderId',
    method: 'post',
    params: data
  })
}

// 根据id获取评价
export function getAppraiseById(data) {
  return request({
    url: 'api/appraise/getAppraiseById',
    method: 'post',
    params: data
  })
}

// 根据商品id获取评价
export function queryAppraiseByCargo(data) {
  return request({
    url: 'api/appraise/queryAppraiseByCargo',
    method: 'post',
    params: data
  })
}

// 根据id获取用户信息
export function getMemberById(data) {
  return request({
    url: 'api/member/getMemberById',
    method: 'post',
    params: data
  })
}

// 根据商品id获取热门评价
export function queryTopAppraiseByCargo(data) {
  return request({
    url: 'api/appraise/queryTopAppraiseByCargo',
    method: 'post',
    params: data
  })
}






















