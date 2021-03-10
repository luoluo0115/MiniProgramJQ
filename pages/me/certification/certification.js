const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    iscerame: false,
    username: "",
    IDCard: "",
    license_verify_id: 0,
    list: [],
    steps: [{
        text: '步骤一',
        desc: '实名认证'
      },
      {
        text: '步骤二',
        desc: '人脸识别'
      },
      {
        text: '步骤三',
        desc: '确认信息'
      }
    ],
    isID: true,
    isHidden: true,
    color: "#ff6f10", //按钮颜色
    disabled: false, //是否可以点击
    getTxt: "开始认证", //显示文字
    timer: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      username: options.legal_person,
      IDCard: options.id_no,
      license_verify_id: options.license_verify_id,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  OnChange: function () {
    if (this.data.username == '') {
      Toast('请输入姓名');
      return;
    }
    if (this.data.IDCard == '') {
      Toast('请输入身份证号');
      return;
    }
    this.setData({
      active: 1,
      iscerame: true,
      isID: false
    });
    this.cut();
  },
  cut: function () {
    if (this.data.payButtonClicked) {
      wx.showToast({
        title: '休息一下~',
        icon: 'none'
      })
      return
    }
    this.data.payButtonClicked = true
    setTimeout(() => {
      this.data.payButtonClicked = false
    }, 1000)
    // 防止连续点击--结束
    var ctx = wx.createCameraContext();
    var that = this;
    setTimeout(function (e) {
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          Toast.loading({
            mask: false,
            duration: 0,
            message: '认证中...'
          });
          wx.uploadFile({
            url: api.FaceVerify,
            filePath: res.tempImagePath,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data", //记得设置
              'Authorization': 'Bearer ' + wx.getStorageSync('qh_access_token') //设置验证
            },
            formData: {
              'Number': e.IDCard,
              'name': e.username,
              'openid': app.globalData.openid,
              'user_id': app.globalData.user_id,
              'license_verify_id': e.license_verify_id,
            },
            success: function (res) {
              console.log(res.data, 'res.data')
              var result = JSON.parse(res.data);
              console.log(result);
              if (result.success == true) {
                Toast.success('认证成功');
                setTimeout(function (e) {
                  wx.redirectTo({
                    url: '../authorization/authorization'
                  });
                }, 2000)

              } else if (result.success == false) {
                Toast.fail(result.msg);
                setTimeout(function (e) {
                  wx.redirectTo({
                    url: '../certification/certification?legal_person=' + that.data.username + '&id_no=' + that.data.IDCard + '&license_verify_id=' + that.data.license_verify_id
                  });
                  // wx.navigateBack({
                  //   delta: 1,
                  // })
                }, 4000)
              }

            },
            fail: function (res) {
              console.log(res);
            },
          })

        }
      })
    }, 3000, that.data)
  },
  goFaceVerifiy: function (e) {
    if (this.data.payButtonClicked) {
      wx.showToast({
        title: '休息一下~',
        icon: 'none'
      })
      return
    }
    this.data.payButtonClicked = true
    setTimeout(() => {
      this.data.payButtonClicked = false
    }, 1000)
    // 防止连续点击--结束
    Toast.loading({
      mask: false,
      duration: 0,
      message: '开始认证...'
    });
    var that = this;
    var times = 0;
    var success = 1;
    this.setData({
      timer: setInterval(function () {
        times++
        if (times >= 4) {
          that.setData({
            color: "#ff6f10",
            disabled: false,
            getTxt: "重新认证",
          })
          clearInterval(that.data.timer)
        } else {
          that.setData({
            getTxt: "开始认证" + times + "s",
            color: "#999",
            disabled: true
          })
          Toast.clear();
          if (success == 1) {
            success = 0;
            var ctx = wx.createCameraContext();
            ctx.takePhoto({
              quality: 'high',
              success: (res) => {

                wx.uploadFile({
                  url: api.FaceVerify,
                  filePath: res.tempImagePath,
                  name: 'file',
                  header: {
                    "Content-Type": "multipart/form-data", //记得设置
                    'Authorization': 'Bearer ' + wx.getStorageSync('qh_access_token') //设置验证
                  },
                  formData: {
                    'Number': that.data.IDCard,
                    'name': that.data.username,
                    'openid': app.globalData.openid,
                    'user_id': app.globalData.user_id,
                    'license_verify_id': that.data.license_verify_id,
                  },
                  success: function (res) {
                    console.log(res.data, 'res.data')
                    var result = JSON.parse(res.data);
                    if (result.success == true) {
                      let cid = result.customer_info_id;
                      success = 0;
                      clearInterval(that.data.timer)
                      that.setData({
                        color: "#ff6f10",
                        disabled: false,
                        getTxt: "认证成功",
                      })
                      Toast.success('认证成功');
                      setTimeout(function (e) {
                        wx.redirectTo({
                          url: '../authorization/authorization?cid=' + cid
                        });
                      }, 1000)

                    } else if (result.success == false) {
                      Toast.fail(result.msg);
                      setTimeout(function (e) {
                        success = 1;
                      }, 800)
                      //222351 身份证号码和姓名不匹配 -222354 -222355 -222350
                      if (result.error_code == '222351' || result.error_code == '222350' || result.error_code == '222354' || result.error_code == '222355') {
                        clearInterval(that.data.timer)
                        setTimeout(function (e) {
                          wx.navigateBack({
                            delta: 1,
                          })
                        }, 1200)
                      }
                    }
                  },
                  fail: function (res) {
                    console.log(res);
                  },
                })
              }
            })
          }
        }
      }, 2000)
    })

  },
  nameInput: function (e) {
    this.setData({
      username: e.detail
    })
  },
  NumberInput: function (e) {
    this.setData({
      IDCard: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this;

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);
    this.setData({
      timer: null
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
    this.setData({
      timer: null
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})