// components/detailreal.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    scanResult:{
      type: Object
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCopy(){
      wx.setClipboardData({
        data: this.data.scanResult.text,
      })
    }
  }
})
