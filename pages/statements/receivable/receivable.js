// pages/statements/receivable/receivable.js
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
    sumReceivableData: {amt_end:0},
    arData:[]
  },
   //应收账款
   QueryAccountReceivable: function(e){
    let that = this;
    util.request(api.QueryAccountReceivableUrl,{
      openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      account_month:app.globalData.curr_date.split('-').join("")
  },'POST').then(function(res){
    console.log(res,'成功');
    if(res.data.success==true){
      that.setData({
        sumReceivableData: res.data.sumData[0],
        arData: res.data.arData
      });
    }else{
      that.setData({
        sumReceivableData: {amt_end:0},
        arData:[]
      });
    }
  })
    // wx.request({
    //   url: api.QueryAccountReceivableUrl, //应收账款接口地址
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
    //         sumReceivableData: res.data.sumData[0],
    //         arData: res.data.arData
    //       });
    //     }else{
    //       that.setData({
    //         sumReceivableData: {amt_end:0}
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      date:  app.globalData.curr_date,
    });
    this.QueryAccountReceivable();
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