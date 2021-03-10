// pages/me/personal/personal.js
var api = require('../../../config/api.js');
var app = getApp();
import Dialog from '../../../vant-weapp/dist/dialog/dialog';
import Toast from '../../../vant-weapp/dist/toast/toast';
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    date: [],
    index: [],
    companyName: [],
    show: false,
    customer_in_charge_number: '',
    customer_in_charge_ext: '',
    customerList: [],
    companyList: app.globalData.customer_info_id_list,
    customer_info_id: '',
    messageCount: 0, //消息个数
  },
  QueryCustomerList: function () {

    let that = this;
    util.request(api.QueryCustomerListUrl, {
      openid: app.globalData.openid,
      customer_info_id: app.globalData.curr_customer_info_id,
    }, 'POST').then(function (res) {
      //var customerList=JSON.stringify(res.data.customerList);
      console.log(res.data.customerList, '公司列表');
      if (res.data.success == true) {
        that.setData({
          customerList: res.data.customerList[0]
        });
        var customer_in_charge_ext = res.data.customerList[0].customer_in_charge_ext;
        app.globalData.customer_in_charge_ext = customer_in_charge_ext;
        var customer_in_charge_number = customer_in_charge_ext.substring(customer_in_charge_ext.length - 1);
        app.globalData.customer_in_charge_number = customer_in_charge_number;
        console.log(customer_in_charge_number, "我的公司客服");
      } else {
        that.setData({
          customerList: [],
          customer_in_charge_ext: [],
          customer_in_charge_number: []
        });
      }
    })


  },
  showCustomDialog() {
    this.setData({
      show: true
    });
  },
  onClickConfirm() {
    const message = '电话: 021-6467 6767 按 3 转按 ' + app.globalData.customer_in_charge_number;
    Dialog.confirm({
        title: '您的专属客服' + app.globalData.customer_in_charge_ext,
        message,
        asyncClose: true
      })
      .then(() => {
        wx.makePhoneCall({
          phoneNumber: '021-6467 6767',
        })
        Dialog.close();
      })
      .catch(() => {
        Dialog.close();
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //时间与公司名列表
     var list=[];
     if(app.globalData.customer_info_id_list!=''){
        this.QueryCustomerList();
     }else{
       Toast('暂无公司信息');
     }
  },
  //跳好享得利小秘书
  goMinipro: function () {
    wx.navigateToMiniProgram({
      appId: 'wxa9b6b75004727415',
      path: 'pages/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.index != app.globalData.index || app.globalData.refresh) {
      this.setData({
        index: app.globalData.index,
      });
      var list = [];
      if (app.globalData.customer_info_id_list != '') {
        this.QueryCustomerList();
      } else {
        Toast('暂无公司信息');
      }
    }
    //消息个数
    this.QueryMessageCount();
  },
  /**
   * 获取消息个数
   */
  QueryMessageCount: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let user_id = app.globalData.user_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.QueryMessageCount, {
      cid: customer_info_id,
      curr_month: curr_month,
      ui: user_id,
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          messageCount: res.data.total,
        });
      } else {
        that.setData({
          messageCount: 0,
        });
      }
    })

  },
  /*跳转我的优惠券*/
  bindTapmyCoupon: function () {
    wx.navigateTo({
      url: '../myCoupon/myCoupon?customerList=' + JSON.stringify(this.data.customerList)
    })
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

  },
  getUserInfo: function (e) {
    console.log(e)

  },
})