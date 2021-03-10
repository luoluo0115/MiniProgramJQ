// pages/invoice/invoiceIm/invoiceIm.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zInvoiceQty:0,
    zInvoiceAmount:0,
    zInvoiceTax:0,
    pInvoiceQty:0,
    pInvoiceAmount:0,
    pInvoiceTax:0,
    InvoiceQty:0,
    InvoiceAmount:0,
    InvoiceTax:0,
    invoiceFileList: '',
  },
   /**
   * 预览图片
   */
  previewImage: function (event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [imgList] // 需要预览的图片http链接列表
    })
  },
  QueryInvoiceCount: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    util.request(api.BillApi.QueryInvoiceCount, {
      cid: customer_info_id,
      curr_month: curr_month,
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        that.setData({
          zInvoiceQty:res.data.data.dt2[0].zys,
          zInvoiceAmount:res.data.data.dt2[0].zym,
          zInvoiceTax:res.data.data.dt2[0].zye,
          pInvoiceQty:res.data.data.dt3[0].zys,
          pInvoiceAmount:res.data.data.dt3[0].zym,
          pInvoiceTax:res.data.data.dt3[0].zye,
          InvoiceQty:res.data.data.dt[0].zys,
          InvoiceAmount:res.data.data.dt[0].zym,
          InvoiceTax:res.data.data.dt[0].zye,
        });
      } else {
        that.setData({
          zInvoiceQty:0,
          zInvoiceAmount:0,
          zInvoiceTax:0,
          pInvoiceQty:0,
          pInvoiceAmount:0,
          pInvoiceTax:0,
          InvoiceQty:0,
          InvoiceAmount:0,
          InvoiceTax:0,
        });
      }
    })
  },
  QueryInvoiceFile: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.BillApi.QueryInvoiceDetail, {
      cid: customer_info_id,
      curr_month: curr_month,
      pageIndex: 1,
      pageSize: 100
    }, 'POST').then(function (res) {
      if (res.data.list != null && res.data.list != '') {
        that.setData({
          invoiceFileList: res.data.list,
        });
      } else {
        that.setData({
          invoiceFileList: '',
          msg: '暂无数据'
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
    this.setData({
      curr_status: wx.getStorageSync('curr_status'),
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //销项开票查询
    this.QueryInvoiceFile();
    this.QueryInvoiceCount();
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