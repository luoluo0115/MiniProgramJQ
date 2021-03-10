var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
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
    ZQty : 0,//专票数量
    ZAmount : 0,//专票金额
    ZtaxAmount : 0,//专票税额
    PQty : 0,//普票数量
    PAmount : 0,//普票金额
    PtaxAmount : 0,//普票税额
    ZtaxPrice:0,
    PtaxPrice:0,
    ImgUrl:api.ImgUrl,
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
          //专票
          ZQty : res.data.data.dt4[0].zys,
          ZAmount : res.data.data.dt4[0].zym,
          ZtaxAmount : res.data.data.dt4[0].zye,
          ZtaxPrice:res.data.data.dt4[0].zym+res.data.data.dt4[0].zye,
          //普票
          PQty : res.data.data.dt5[0].zys,//普票数量
          PAmount : res.data.data.dt5[0].zym,//普票金额
          PtaxAmount : res.data.data.dt5[0].zye,//普票税额
          PtaxPrice:res.data.data.dt5[0].zym+res.data.data.dt5[0].zye
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

          ZQty : 0,
          ZAmount : 0,
          ZtaxAmount : 0,
          PQty : 0,//普票数量
          PAmount : 0,//普票金额
          PtaxAmount : 0,//普票税额
        });
      }
    })
  },
  /**
   * 上传支出票据
   */
  gotoUpload: function (e) {
    var data = e.currentTarget.dataset.item;
    console.log(data)
    wx.navigateTo({
      url: '/pages/bill/Income-upload/Income-upload?data='+JSON.stringify(data),
    })
  },
  gotoUploadHz: function (e) {
    var type = e.currentTarget.dataset.type;
    console.log('type:'+type)
    wx.navigateTo({
      url: '/pages/bill/Income-detail/Income-detail?type='+type,
    })
  },
  /**
   * 支出票据明细
   */
  gotoDetail: function (e) {
    var data = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/bill/Incometest/Incometest?data='+JSON.stringify(data),
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
   * 操作介绍
   */
  helpTips: function (event) {         
    var src = this.data.ImgUrl + "A011";    
    var imgList1 = this.data.ImgUrl + "A011";
    var imgList2 = this.data.ImgUrl + "A012";
    var imgList3 = this.data.ImgUrl + "A013";  
    //图片预览
    wx.previewImage({
      current: src,
      urls: [imgList1,imgList2,imgList3]
    })
  },
})