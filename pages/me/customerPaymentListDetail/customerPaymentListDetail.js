// pages/me/customerPaymentListDetail/customerPaymentListDetail.js
// pages/me/agreement/agreement.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerList:[]
  },
  QueryCustomerPaymentListDetail:function(depute_service_master_id) {
    console.log(depute_service_master_id,'支付信息id')
    let that = this;
    util.request(api.QueryCustomerPaymentListDetailUrl,
      { openid:"oDiCI5Az1N4321VyOQwQxsfqIPwM",customer_info_id:7642,depute_service_master_id:depute_service_master_id}
      ,'POST').then(function(res){
        //var customerList=JSON.stringify(res.data.customerList);
        if(res.data.success==true){
          that.setData({
            customerList:res.data.customerList
          });
         
          console.log(res.data.customerList , "待支付信息");
        }else{
          that.setData({
            customerList:[]
          });
          console.log(res.data.customerList , "待支付信息错误");

        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.depute_service_master_id,'待支付明细');
    
    this.QueryCustomerPaymentListDetail(options.depute_service_master_id);
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