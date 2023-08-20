import transFunc from '../../utils/util.js'
import CryptoJS from 'crypto-js'
import { weBtoa, weAtob } from './weapp-jwt.js'
// import CryptoJS from '../../node_modules/crypto-js';

// global.CryptoJS = require('crypto-js');

// wx.request({
//   url: "https://www.baidu.com/",
//   // 请求一个不存在的地址，只为获取当前页面的域名
//   success:  (res) {
//     console.log('res',res); // 输出当前页面的域名
//     var domain = res.request.host;
//     console.log('domain',domain); // 输出当前页面的域名
//   }
// });


const app = getApp()

// BEGIN: ed8c6549bwf9
const APPID = '4e4968c5'
const API_SECRET = 'ZDVmZGYxMDAxNjJhNDhjZDZlMTUxNjI5'
const API_KEY = 'b696618376b0d18d0c5f7485e751629a'

var total_res = "";
let ttsWS;



Page({
  data: {
    query: '',// 用户输入的要翻译的文本
    content: '', // 翻译的文本
    curLangTxt: app.globalData.curLang.chs,
  },
  // 跳转到选择语言
  gotoChange () {
    wx.navigateTo({
      url: '/pages/change/change',
    })
  },
  onLoad () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    })
  },
  // // 翻译事件
  // async translateHandler () {
  //   // 1. 拿到用户输入的值  2. 调用接口进行翻译
  //   const query = this.data.query
  //   if (!query) {
  //     return
  //   }
  //   try {
  //     const content = await transFunc(query, "auto", app.globalData.curLang.lang)
  //     // 1）修改 content 的值，以便翻译结果能够显示出来
  //     this.setData({
  //       content
  //     })
  //     // 2）将此次翻译结果存储到全局的 history 里面
  //     app.globalData.history.unshift({
  //       sourceTxt: this.data.query,
  //       resultTxt: content
  //     })
  //     // 3）将 history 存储到本地，方便下一次进入小程序的时候，能够加载之前的历史记录
  //     wx.setStorage({
  //       key: 'history',
  //       data: app.globalData.history
  //     })
  //   } catch (err) {
  //     console.error(err)
  //   }

  // },
  // onShow () {
  //   this.setData({
  //     curLangTxt: app.globalData.curLang.chs,
  //   }, () => {
  //     this.translateHandler()
  //   })
  // },
  inputHandle () {

  },
  // 该生命周期钩子函数会在分享内容的时候触发
  onShareAppMessage () {
    // 此事件处理函数需要 return 一个 Object
    return {
      title: "这是一个可以翻译13种语言的小程序",
      path: "/pages/index/index",
      imageUrl: "/imgs/share.jpeg"
    }
  },
  async sendBtnHandle (e) {
    this.setData({
      content : ''
    })
    console.log('sendBtnHandler', e)
    this.connectWebSocket()
    // console.log('wsUrl', wsUrl);
  },

  getWebsocketUrl () {
    return new Promise((resolve, reject) => {
      var apiKey = API_KEY
      var apiSecret = API_SECRET
      var url = 'wss://spark-api.xf-yun.com/v1.1/chat'
      // var host = 'spark-api.xf-yun.com'
      var host = "servicewechat.com"
      // 改写:获取设备信息
      // const systemInfo = wx.getSystemInfoSync();

      // const isMobile = systemInfo.platform === 'ios' || systemInfo.platform === 'android';

      // 如果是移动端，从本地存储获取域名信息
      // if (isMobile) {
      //   host = wx.getStorageSync('host');
      //   console.log(host);
      // } else {
      //   // 非移动端，使用location.host获取域名信息
      //   host = location.host;
      //   console.log(host);
      // }
      var date = new Date().toGMTString()
      var algorithm = 'hmac-sha256'
      var headers = 'host date request-line'
      var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`
      var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
      var signature = CryptoJS.enc.Base64.stringify(signatureSha)
      var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
      // console.log('authorizationOrigin', authorizationOrigin)
      var authorization = weBtoa(authorizationOrigin)
      // url = `${url}?authorization=${wx.arrayBufferToBase64(authorization)}&date=${date}&host=${host}`
      // console.log('authorization', authorization)
      url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
      resolve(url)
    })
  },

  connectWebSocket () {
    wx.getSystemInfo({
      success: res => {
        this.getWebsocketUrl().then(url => {
          console.log('URL', url);

          console.log('wx.createWebSocket', wx.createWebSocket);
          console.log('wx.connectSocket', wx.connectSocket);
          if (wx.createWebSocket) {
            ttsWS = wx.connectSocket({ url });
          } else if (wx.connectSocket) {
            ttsWS = wx.connectSocket({ url });
            console.log('ttsWS', ttsWS);
          } else {
            alert('浏览器不支持WebSocket');
            return;
          }
          ttsWS.onOpen(() => {
            console.log('WebSocket连接打开');
            this.webSocketSend();
          });
          ttsWS.onMessage((res) => {
            this.result(res.data);
          });
          ttsWS.onError((res) => {
            alert('WebSocket报错，请f12查看详情');
            console.error(`详情查看：${encodeURI(url.replace('wss:', 'https:'))}`);
          });
          ttsWS.onClose((res) => {
            console.log(res);
          });
        });
      },
      fail: err => {
        console.error(err);
      }
    });
  },
  // websocket发送数据
  webSocketSend () {
    var params = {
      "header": {
        "app_id": APPID,
        // "uid": "fd3f47e4-d"
      },
      "parameter": {
        "chat": {
          "domain": "general",
          "temperature": 0.5,
          "max_tokens": 1024
        }
      },
      "payload": {
        "message": {
          "text": [
            {
              "role": "user",
              "content": "中国第一个皇帝是谁？"
            },
            {
              "role": "assistant",
              "content": "秦始皇"
            },
            {
              "role": "user",
              "content": "秦始皇修的长城吗"
            },
            {
              "role": "assistant",
              "content": "是的"
            },
            {
              "role": "user",
              "content": this.data.query
            }
          ]
        }
      }
    }
    console.log(JSON.stringify(params))
    ttsWS.send({
      data: JSON.stringify(params),
      success: res => {
        console.log('send message success', res);
      },
      fail: err => {
        console.log('send message fail', err);
      },
      complete: res => {
        console.log('send message complete', res);
      }

    })
    // ttsWS.send(params)
  },

  // websocket接收数据的处理
  result (resultData) {
    let jsonData = JSON.parse(resultData)
    // console.log(jsonData);
    const { header, payload, payload: {
      choices, choices: {
        seq,
        status,
        text,
        text: [{ content }]
      }
    } } = jsonData
    // console.log(content);
    // total_res = total_res + content
    this.setData({
      content:this.data.content+content
    })
    // $('#output_text').val(total_res)
    console.log(total_res)
    // 提问失败
    if (jsonData.header.code !== 0) {
      alert(`提问失败: ${jsonData.header.code}:${jsonData.header.message}`)
      console.error(`${jsonData.header.code}:${jsonData.header.message}`)
      return
    }
    if (jsonData.header.code === 0 && jsonData.header.status === 2) {
      ttsWS.close()
    }
  },
})
