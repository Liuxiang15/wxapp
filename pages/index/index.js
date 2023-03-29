import transFunc from '../../utils/util.js'
const app = getApp()

Page({
  data: {
    query:'',// 用户输入的要翻译的文本
    content : '', // 翻译的文本
    curLangTxt:app.globalData.curLang.chs,
  },
  // 跳转到选择语言
  gotoChange(){
    wx.navigateTo({
      url: '/pages/change/change',
    })
  },
  onLoad(){
    wx.showShareMenu({
      withShareTicket : true,
      menus : ["shareAppMessage", "shareTimeline"]
    })
  },
  // 翻译事件
  async translateHandler(){
    // 1. 拿到用户输入的值  2. 调用接口进行翻译
    const query = this.data.query
    if(!query){
      return
    }
    try {
      const content = await transFunc(query, "auto", app.globalData.curLang.lang)
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
  onShow(){
    this.setData({
      curLangTxt:app.globalData.curLang.chs,
    },()=>{
      this.translateHandler()
    })
  },
  inputHandle(){

  },
  // 该生命周期钩子函数会在分享内容的时候触发
  onShareAppMessage(){
    // 此事件处理函数需要 return 一个 Object
    return {
      title : "这是一个可以翻译13种语言的小程序",
      path : "/pages/index/index",
      imageUrl : "/imgs/share.jpeg"
    }
  }
})
