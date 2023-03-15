
const app = getApp()

Page({
  data: {
    
  },
  // 跳转到选择语言
  gotoChange(){
    wx.navigateTo({
      url: '/pages/change/change',
    })
  }
})
