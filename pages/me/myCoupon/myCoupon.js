const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
import Dialog from '../../../vant-weapp/dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myCouponList: [],
    status: "N",
    active: 0,
    curr_customer_name: '',
    customerList:''
  },
  //我的优惠券
  QueryMyCoupon: function (e) {
    let that = this;
    util.request(api.QueryMyCouponUrl, //查询我的订单
      {
        openid: app.globalData.openid,
        user_id: app.globalData.user_id,
        status: e,
        customer_info_id: app.globalData.curr_customer_info_id
      }, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success == true) {
        that.setData({
          myCouponList: res.data.myCouponList,
        });
        console.log(res.data.myCouponList, 'res.data.myCouponList,')
      } else {
        that.setData({
          myCouponList: [],
          msg: res.data.msg
        });

      }
    })

  },
  //切换我的优惠券title
  onChange(event) {
    if (event.detail.title == '待使用') {
      this.QueryMyCoupon('N')
    } else if (event.detail.title == '已使用') {
      this.QueryMyCoupon('Y')
    } else if (event.detail.title == '已过期') {
      this.QueryMyCoupon('X')
    } else if (event.detail.title == '待绑定') {
      this.QueryMyCoupon('W')
    }

  },
  goProduct: function (e) {
    let item_id = e.currentTarget.dataset.item_id
    let coupon_category = e.currentTarget.dataset.coupon_category
    if (item_id == "999998") {
      wx.redirectTo({
        url: '/pages/invoice/invoiceInfo/invoiceInfo'
      })
    } else if ((item_id == "999998")) {
      wx.switchTab({
        url: '/pages/bill/index/index'
      })
    } else {
      wx.switchTab({
        url: '/pages/product/index/index'
      })
    }


  },

  BindCoupon: function (e) {
    var self = this;
    let item = e.currentTarget.dataset.item
    let promotion_coupon_user_id = item.promotion_coupon_user_id;
    var promotion_coupon_id = item.promotion_coupon_id;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_customer_name = app.globalData.curr_customer_name;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let openid = app.globalData.openid;
    wx.showModal({
      title: '提示',
      content: '确定绑定该优惠券到('+curr_customer_name+')吗？',
      success: function (sm) {
        if (sm.confirm) {           
          util.request(api.PostBindCouponUrl, {
            openid: openid,
            promotion_coupon_user_id: promotion_coupon_user_id,
            promotion_coupon_id: promotion_coupon_id,
            customer_info_id: customer_info_id,
            curr_month: curr_month,
            user_id: user_id,
          }, 'POST').then(function (res) {
            console.log(res);
            if (res.data.success == true) {
              self.QueryMyCoupon('W');
              Toast.success(res.data.msg);
            } else {
              Toast.fail(res.data.msg);
            }
          })
        } else if (sm.cancel) {
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
   
    let that = this;
    let curr_customer_name = app.globalData.curr_customer_name;
    that.setData({
      curr_customer_name: curr_customer_name,
      customerList:JSON.parse(options.customerList)
    })
    console.log(that.data.customerList.customer_name,'customerList')
    that.QueryMyCoupon(that.data.status)
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

})