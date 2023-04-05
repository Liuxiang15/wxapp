Page({
  data: {
    codeText: "", // 存储用户输入的二维码文本
    imgTempFilePath: "", // 生成的二维码图片路径
  },
  // 根据文本来生成二维码图片
  onGenerate () {
    // 我们请求接口之后，会生成一张二维码的图片
    // 我们需要将这张图片下载下来
    wx.downloadFile({
      url: "http://apis.juhe.cn/qrcode/api?key=5a4f1232be1db0388b7544ebee55e542&type=2&text=" + this.data.codeText,
      success: res => {
        this.setData({
          imgTempFilePath: res.tempFilePath
        })
      }
    })
  },
  saveImage (e) {
    const url = e.currentTarget.dataset.url
    //用户需要授权
    wx.getSetting({
      success: (res) => {
        // 没有授权就去要授权 
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              // 同意授权
              this.saveImg1(url);
            },
            fail: (res) => {
              console.log(res);
            }
          })
        } else {
          // 已经授权了
          this.saveImg1(url);
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  saveImg1 (url) {
    // wx.getImageInfo()可以获取网络路径的图片
    wx.getImageInfo({
      src: url,
      success: (res) => {
        let path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: (res) => {
            console.log(res);
          },
          fail: (res) => {
            console.log(res);
          }
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  bindInput () { }
})