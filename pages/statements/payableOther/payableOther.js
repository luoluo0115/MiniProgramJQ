// pages/statements/payableOther/payableOther.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sumPayData: {amt_begin:0},
    apData: 0

  },
  /**
   * 其他应付查询
   */
  QueryAccountPayableOther:function(e){
    let that = this;
    util.request(api.QueryAccountPayableOtherUrl,{
      openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      account_month:app.globalData.curr_date.split('-').join("")
  },'POST').then(function(res){
    console.log(JSON.stringify(res),'其他应付')
    if(res.data.success==true){
      that.setData({
        sumPayData: res.data.sumData[0],
        apData: res.data.apData
      });
    }else{
      that.setData({
        sumPayData: {amt_begin:0},
        apData: 0
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
    this.QueryAccountPayableOther();
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