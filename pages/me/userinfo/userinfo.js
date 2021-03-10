var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
import Dialog from '../../../vant-weapp/dist/dialog/dialog';
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    custList: [],
    showEmail: false,
    email: '',
    smscode: '',
    btntext: '获取验证码',
    isClick: false, //获取验证码按钮，默认允许点击
  },
  goEmail: function () {
    this.setData({
      showEmail: true
    })
  },
  onClose() {
    this.setData({
      close: false
    });
  },

  emailInput: function (e) {
    //获取输入邮箱号
    this.setData({
      email: e.detail
    })
  },
  codeInput: function (e) {
    //获取输入验证码
    this.setData({
      smscode: e.detail
    })
  },
  /**
   * 获取验证码
   */
  getCode: function () {
    let that = this;
    let emailreg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    //提示
    if (that.data.email == '' || that.data.email == null) {
      const text = second => `请输入邮箱号`;
      const toast = Toast({
        message: text(3)
      });
      return;
    } else if (!emailreg.test(that.data.email)) {
      const text = second => `邮箱号格式不正确`;
      const toast = Toast({
        message: text(3)
      });
      return;
    } else {
      //获取验证码
      var _this = this
      var coden = 180 // 定义60秒的倒计时
      _this.setData({ // _this这里的作用域不同了
        btntext: '180后重新发送',
        isClick: true,
      })
      var codeV = setInterval(function () {
        _this.setData({ // _this这里的作用域不同了
          btntext: '重新获取(' + (--coden) + 's)',
        })
        if (coden == -1) { // 清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
          clearInterval(codeV)
          _this.setData({
            btntext: '获取验证码',
            isClick: false
          })
        }
      }, 1000) //  1000是1秒
      //获取验证码
      util.request(api.PostVerifyUser, {
        openid: app.globalData.openid,
        user_email: that.data.email,
        user_id: app.globalData.user_id,
        user_name: app.globalData.user_name
      }, 'POST', true).then(function (res) {
        //获取验证码成功
        that.setData({
          syscode: res.data.code
        })
      })
    }
  },
  /**
   * 确认
   */
  confirm: function (event) {
    let emailreg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (this.data.email == '' || this.data.email == null) {
      this.setData({
        showEmail: true,
      })
      const text = second => `请输入邮箱号`;
      const toast = Toast({
        message: text(3)
      });
      return;
    } else if (!emailreg.test(this.data.email)) {
      this.setData({
        showEmail: true,
      })
      const text = second => `邮箱号格式不正确`;
      const toast = Toast({
        message: text(3)
      });
      return;
    };
    if (this.data.smscode == '' || this.data.smscode == null) {
      this.setData({
        showEmail: true,
      })
      const text = second => `请输入验证码`;
      const toast = Toast({
        message: text(3)
      });
      return;
    };
    //提交
    util.request(api.SaveVerifyCode, {
      openid: app.globalData.openid,
      user_name: app.globalData.user_name,
      user_id: app.globalData.user_id,
      user_email: this.data.email,
      code: this.data.smscode,
    }, 'POST', true).then(function (res) {
      if (res.data.success) {
        wx.redirectTo({
          url: '/pages/me/userinfo/userinfo',
        });
        Toast.success(res.data.msg);
      } else {
        this.setData({
          showEmail: true,
        })
        Toast.fail(res.data.msg);
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  QueryUserInfo: function () {
    let that = this;
    util.request(api.QueryUserInfo, {
      openid: app.globalData.openid,
      cid: app.globalData.curr_customer_info_id,
      user_id: app.globalData.user_id
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        var userInfo = JSON.stringify(res.data.customerList[0]);
        that.setData({
          userInfo: res.data.customerList[0]
        });
      } else {
        that.setData({
          userInfo: []
        });
      }
    })
  },
  /**
   * 个人申请公司列表
   */
  QueryVerifyCustList: function () {
    let that = this;
    util.request(api.QueryVerifyCustListUrl, {
      openid: app.globalData.openid,
      ui: app.globalData.user_id,
      cname: app.globalData.curr_customer_name
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          custList: res.data.dataList,
        });
      } else {
        that.setData({
          custList: [],
        });

      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.QueryUserInfo();
    this.QueryVerifyCustList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let user_id = app.globalData.user_id
    let referral_code = wx.getStorageSync("referral_code");
    return {
      title: '巧记账',
      path: '/pages/index/index?referral_code=' + referral_code + '&user_id=' + user_id,
    }
  }
})