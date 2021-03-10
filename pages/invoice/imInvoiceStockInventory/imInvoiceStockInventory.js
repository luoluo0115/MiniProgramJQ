// pages/invoice/imInvoiceStockInventory/imInvoiceStockInventory.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoice_inventory:[]
  },
  QueryImInvoiceStockInventory: function(e){
    //开票信息
    let that = this;
    util.request(api.QueryImInvoiceStockInventoryUrl,
      { openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id
    },'POST').then(function(res){
      console.log(JSON.stringify(res.data.ominvoicedata),'发票统计数据');
      if(res.data.success== true ){
        that.setData({
          invoice_inventory: res.data.invoice_inventory
        });
      }
      else{
        that.setData({
          invoice_inventory: []
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
  //发票库存查询
  this.QueryImInvoiceStockInventory();
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