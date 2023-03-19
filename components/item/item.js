const app = getApp();
Component({
  properties: {
    item: Object
  },
  methods: {
    checkHandle() {
      // 1. 拿到用户点击的这一项
      const item = this.properties.item;
      // 2. 从全局数据中找到这一项
      const listItem = app.globalData.list.find(i => i.content === item.content);

      // 3. 修改状态，修改完毕后给出提示
      listItem.isComplete = !listItem.isComplete;
      wx.showToast({
        title: `标记${listItem.isComplete ? '完成': '未完成'}`,
        icon: 'success'
      })
      // 4. 修改当前这一项的完成状态
      // 注意：这里只设置了isComplete，会导致content丢失
      // 如果不触发下面的fresh， 当前item就没有content字段
      this.setData({
        item: {
          content:item.content,
          isComplete: !item.isComplete
        }
      })
      
      // 5. 需要触发父组件的 fresh 事件，从而更新页面的 list
      this.triggerEvent('fresh');
    },
    deleteHandle() {
      wx.showModal({
        title: '确认删除',
        content: "是否要删除此项任务？",
        success: res => {
          if (res.confirm) {
            // 1. 拿到用户点击的这一项
            const item = this.properties.item;
            // 2. 从全局数据中找到这一项的下标
            const index = app.globalData.list.findIndex(i => i.content === item.content);
            // 3. 从全局中删除这一项
            app.globalData.list.splice(index, 1);

            wx.showToast({
              title: '删除成功',
            });

            this.triggerEvent("fresh");
          }
        }
      })
    }
  }
})