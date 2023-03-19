// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    newContent : "", // 用户输入新的待办事项
    list: app.globalData.list // 从全局 list 中获取所有任务
  },
  inputHandle(){}
})
