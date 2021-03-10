// pages/invoice/invoiceOm/invoiceOm.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    withReceiptsList: '',
    maxPageCount : 0,
    invoice_total_amt : 0,
    invoice_total_tax : 0,
    invoice_total_items : 0,
  },
  /**
   * 进行认证查询
   */
  QueryWithReceipts: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    util.request(api.BillApi.PostWithReceipts, {
      cid: customer_info_id,
      curr_month: curr_month,
      pageSize:100,
      pageIndex:1
    }, 'POST').then(function (res) {
      console.log(res,'进项')
      if (res.data.success == true) {
        that.setData({
          withReceiptsList: res.data.list,
          maxPageCount : res.data.maxPageCount,
          invoice_total_amt : res.data.list2.invoice_total_amt,
          invoice_total_tax : res.data.list2.invoice_total_tax,
          invoice_total_items : res.data.list2.invoice_total_items,
        });
      } else {
        that.setData({
          withReceiptsList: '',
          maxPageCount : 0,
          invoice_total_amt : 0,
          invoice_total_tax : 0,
          invoice_total_items : 0,
        });
      }
    })

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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //进项开票查询
    this.QueryWithReceipts();
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

  }
})