// pages/statements/advanceAccountPayable/advanceAccountPayable.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:app.globalData.curr_date
  },
  QueryAdvanceAccountPayable: function(e){
    //预付账款
    let that = this;
    util.request(api.QueryAdvanceAccountPayableUrl,{
      openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      account_month:app.globalData.curr_date.split('-').join("")
  },'POST').then(function(res){
    if(res.data.success==true){

      that.setData({
        sumPayData: res.data.sumData[0],
        amt_end:util.priceSwitch(res.data.sumData[0].amt_end),
        arData: res.data.arData
      });
    }else{
      that.setData({
        sumPayData: {amt_end:'0.00'},
        amt_end:'0.00'
      });
    }   
  })
    // wx.request({
    //   url: api.QueryAdvanceAccountPayableUrl, //预付账款接口地址
    //   header: {
    //     'content-type': 'application/json' ,// 默认值,
    //     'Authorization':'Bearer '+app.globalData.Token //设置验证
    //   },
    //   data: {
    //     openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
    //     account_month:app.globalData.curr_date.split('-').join("")
    //   },
    //   method: "POST",
    //   success (res) {
        
    //     if(res.data.success==true){

    //       that.setData({
    //         sumPayData: res.data.sumData[0],
    //         amt_end:util.priceSwitch(res.data.sumData[0].amt_end),
    //         arData: res.data.arData
    //       });
    //     }else{
    //       that.setData({
    //         sumPayData: {amt_end:'0.00'},
    //         amt_end:'0.00'
    //       });
    //     }
        
    //   },
    //   fail:function(err){
    //     console.log(err);
    //     Toast('网络异常');
    //   }
    // })
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
      date:  app.globalData.curr_date,
    });
    this.QueryAdvanceAccountPayable();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})