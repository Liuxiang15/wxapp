App({
  async onLaunch() {
    // 初始化云服务
    wx.cloud.init({
      env: 'cloud1-3gytnxa2a4c59f07'
    });
    
  },
  globalData: {
    userInfo: null
  }
})