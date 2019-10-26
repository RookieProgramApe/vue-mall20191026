module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "autoprefixer": {
      add: true,
      "browsers": [
        "iOS >= 7",
        "Android >= 4.1"
      ]
    },
    "postcss-pxtorem": {
      "rootValue": 32,
      "propList": ["*"],
      "selectorBlackList": ["vux-", "weui","scroller-","mint-"]
    }
  }
}
