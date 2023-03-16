// pages/history/history.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList:app.globalData.history
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 注意：这里不设置的话数据只是最原始的，不会更新
    this.setData({
      historyList:app.globalData.history
    })
  },
  clearHistory(){
    // 1. 清除全局 history 的值，清除 historyList
    app.globalData.history = [];
    this.setData({
      historyList:app.globalData.history
    })
    // 2. 清除本地缓存，下次进来的时候，历史记录也是空的
    wx.removeStorage({
      key: 'history',
      success(){
        console.log("本地缓存已清除")
        wx.showToast({
          title: '本地缓存已清除',
          icon: "success",
          duration: 1000
        })
      }
    })
  },

})