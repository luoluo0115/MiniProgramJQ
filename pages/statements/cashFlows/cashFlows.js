// pages/statements/cashFlows/cashFlows.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 现金流量表查询
   */
  QueryCashFlowsStatement:function(e){
    let that = this;
    util.request(api.QueryCashFlowsStatementUrl,{
      openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      account_month:app.globalData.curr_date.split('-').join("")
  },'POST').then(function(res){

    if(res.data.success==true){
      console.log(res.data.cashdata,'现金流量表')
      that.setData({
        cashdata: res.data.cashdata,
        categorydata:res.data.categorydata
      });
    }else{
      that.setData({
        cashdata: [],
        categorydata:[]
      });
    }
  })
    // wx.request({
    //   url: api.QueryCashFlowsStatementUrl, //现金流量表接口地址
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
    //       console.log(res.data.cashdata,'现金流量表')
    //       that.setData({
    //         cashdata: res.data.cashdata,
    //         categorydata:res.data.categorydata
    //       });
    //     }else{
    //       that.setData({
    //         cashdata: [],
    //         categorydata:[]
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
    this.QueryCashFlowsStatement();
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