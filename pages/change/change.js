const app = getApp()

// pages/change/change.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 从全局获取所有的语言
    langList: app.globalData.langList,
    // 当前默认是什么语言，默认设置为英语
    curLangIndex : app.globalData.curLang.index,
  },
  selectHandle(options){
    const selectIndex = options.currentTarget.dataset.id
    // console.log("index", index)    
    // 接下来需要修改全局的当前语言
    app.globalData.curLang = app.globalData.langList[selectIndex]
    this.setData({
      curLangIndex:selectIndex
    })
    // 重定向会丢失之前的填写记录
    // wx.redirectTo({
    //   url: '/pages/index/index',
    // })
    wx.navigateBack()
  }
})