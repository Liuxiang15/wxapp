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
      this.setData({
        content
      })
    } catch(err){
      console.error(err)
    }
    
  },
  inputHandle(){

  }
})
