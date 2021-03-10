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
    invoice_tax_type: []
  },
  QueryImInvoiceApprovedType: function(e){
    //开票信息
    let that = this;
    util.request(api.QueryImInvoiceApprovedTypeUrl,
      { openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id
    },'POST').then(function(res){
      console.log(JSON.stringify(res.data.ominvoicedata),'核定税种数据');
      if(res.data.success== true ){
        that.setData({
          invoice_tax_type: res.data.invoice_tax_type
        });
      }
      else{
        that.setData({
          invoice_tax_type: []
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
    this.QueryImInvoiceApprovedType();
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