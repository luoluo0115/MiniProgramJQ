//index.js
//获取应用实例
const app = getApp()
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({

  data: {
    motto: '欢迎来到巧记账',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loginBg: api.ImgUrl + 'A003',
    goPage: '',
    goUrl: '',
  },
    /**
   *  获取系统信息
   */
  getSystemInfo: function() {
    let systemInfo;
    wx.getSystemInfo({
      success: function(res) {
        systemInfo=res;
        console.log(res,'设备信息')
      }
    })
    return systemInfo;
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    //获取分享推荐码
    var parent_referral_code = options.referral_code;
    //var parent_referral_code = wx.getStorageSync("parent_referral_code");
    if (parent_referral_code != undefined && parent_referral_code != null && parent_referral_code != "") {
      wx.setStorageSync('parent_referral_code', parent_referral_code);      
    }
    //跳转指定页面
    if (options.goPage) {
      let goPage = decodeURIComponent(options.goPage);
      let cid = decodeURIComponent(options.cid);
      let cdate = decodeURIComponent(options.cdate);
      let url="/pages/product/index/index";
      if(goPage==1)
      {
        url = "/pages/home/taxPayable/taxPayable?cid=" + cid + "&cdate=" + cdate;
      }
      this.setData({
        goPage: goPage,
        goUrl: url,
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReady: function () {
    // 登录
    this.login();
  },
  goTo(event) {
    wx.reLaunch({
      url: '/pages/product/index/index'
    });

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    //获取授权后
    this.login();
  },
  login: function () {
    let that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var code = res.code
          //判断用户是否授权
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                //已经授权，获取用户信息
                wx.getUserInfo({
                  success: function (res) {
                    var systemInfo = that.getSystemInfo();
                    var encryptedData = res.encryptedData
                    var iv = res.iv;
                    var data = {
                      code: code,
                      encryptedData: encryptedData,
                      iv: iv,
                      systemInfo: JSON.stringify(systemInfo)
                    }
                    util.request(api.UserUrl, data, 'POST', true).then(function (res) {
                      console.log(res);
                      app.globalData.openid = res.data.openid;
                      app.globalData.sessKey = res.data.session_key;
                      app.globalData.user_id = res.data.user_id;
                      app.globalData.user_name = res.data.user_name;
                      wx.setStorageSync("referral_code", res.data.referral_code);
                      wx.setStorageSync("is_follow_official_account", res.data.is_follow_official_account);
                      if (!res.data.isRegister) {
                        wx.reLaunch({
                          url: '../registred/registred'
                        });
                      } else {
                        app.globalData.customer_info_id_list = res.data.customer_info_id_list
                        if (that.data.goPage == 1) {
                          wx.reLaunch({
                            url: that.data.goUrl
                          });
                        } else {
                          wx.reLaunch({
                            url: '/pages/product/index/index'
                          });
                        }
                      }
                    })

                  }
                })
              } else {
                //用户未授权
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

})