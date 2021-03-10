// pages/statements/pay/pay.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:app.globalData.curr_date,
    sumPayData: {amt_end:'0.00'},
    amt_end:'0.00'
  },
  QueryAccountPayable: function(e){
    //应付账款
    let that = this;
    util.request(api.QueryAccountPayableUrl,{
      openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      account_month:app.globalData.curr_date.split('-').join("")
  },'POST').then(function(res){

    if(res.data.success==true){

      for(var i =0;i<res.data.apData.length;i++){
        var aptotal=util.priceSwitch(res.data.apData[i].total);
        console.log(aptotal,'应付金额详情233');
      }
      that.setData({
        sumPayData: res.data.sumData[0],
        amt_end:util.priceSwitch(res.data.sumData[0].amt_end),
        apData: res.data.apData
      });
    }else{
      that.setData({
        sumPayData: {amt_end:'0.00'},
        amt_end:'0.00'
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
    this.setData({
      date:  app.globalData.curr_date,
    });
    this.QueryAccountPayable();
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