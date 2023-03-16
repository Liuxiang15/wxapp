import transFunc from '../../utils/util.js'
const app = getApp()

Page({
  data: {
    query:'',// 用户输入的要翻译的文本
    content : '', // 翻译的文本
  },
  // 跳转到选择语言
  gotoChange(){
    wx.navigateTo({
      url: '/pages/change/change',
    })
  },
  // 翻译事件
  async translateHandler(){
    // 1. 拿到用户输入的值  2. 调用接口进行翻译
    try {
      const content = await transFunc(this.data.query, "zh", "en")
      // 1）修改 content 的值，以便翻译结果能够显示出来
      this.setData({
        content
      })
      // 2）将此次翻译结果存储到全局的 history 里面
      app.globalData.history.unshift({
        sourceTxt: this.data.query,
        resultTxt:content
      })
      // 3）将 history 存储到本地，方便下一次进入小程序的时候，能够加载之前的历史记录
      wx.setStorage({
        key:'history',
        data:app.globalData.history
      })
    } catch(err){
      console.error(err)
    }
    
  },
  inputHandle(){

  }
})
