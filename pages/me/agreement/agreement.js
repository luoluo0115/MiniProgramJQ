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
    customer_info_id: app.globalData.customer_info_id,
    customerList:[],
    total_income:[],
    customerPayList:[]
  },
  QuerySumCustomerPaymentList:function() {
    
    let that = this;
    util.request(api.QuerySumCustomerPaymentListUrl,
      { openid:app.globalData.openid, customer_info_id:app.globalData.curr_customer_info_id}
      ,'POST').then(function(res){
        //var customerList=JSON.stringify(res.data.customerList);
        if(res.data.success==true){
          that.setData({
            total_income:res.data.total_income
          });
         
          console.log(res.data.total_income , "待支付信息");
        }else{
          that.setData({
            total_income:[]
          });
          console.log(res.data.total_income , "待支付信息");
        }
      })
    console.log(app.globalData.curr_customer_info_id)
    
  },
  QueryCustomerPaymentList:function() {
    
    let that = this;
    util.request(api.QueryCustomerPaymentListUrl,
      {openid:app.globalData.openid, customer_info_id:app.globalData.curr_customer_info_id}
      ,'POST').then(function(res){
        //var customerList=JSON.stringify(res.data.customerList);
        if(res.data.success==true){
          //var customerList=res.data.customerList;
          for(var i=0;i<res.data.customerList.length;i++){
            res.data.customerList[i].service_content=res.data.customerList[i].service_content.replace(/<br \/\>/g,'\n');
          }
          
          that.setData({
            customerPayList:res.data.customerList
          });
         
          console.log(res.data.customerList , "待支付信息");
        }else{
          that.setData({
            customerPayList:[]
          });
        }
      })
    console.log(app.globalData.curr_customer_info_id)
     
  },
  goPay:function(){
    console.log("预支付");
    let that=this;
    console.log(wx.getStorageSync('token'));
    wx.login({
      success: res => {
         // 发送 res.code 到后台换取 openId, sessionKey, unionId
         if(res.code){
          var code=res.code
          //判断用户是否授权
          wx.getSetting({
            success: res=>{
             if(res.authSetting['scope.userInfo']){
               //已经授权，获取用户信息
               wx.getUserInfo({
                success:function(res){
                  var encryptedData=res.encryptedData
                  var iv = res.iv;
                  var data2 = { code: code, encryptedData: encryptedData, iv: iv }
                  //换取openid
                  util.request(api.WXPayGetOpenid,data2,"POST").then(function(res){
                    var data1={openid:res.data,money:that.data.total_income,name:that.data.customerPayList[0].customer_name,masterid:that.data.customerPayList[0].depute_service_master_id}
                   //预交款
                    util.request(api.WXPayOrderPrepaid,data1,"POST").then(function(res){
                      console.log(res);
                      //发起缴款
                      wx.requestPayment({
                       timeStamp: res.data.timeStamp,
                       nonceStr: res.data.noneStr,
                       package: "prepay_id="+res.data.packge,
                       signType: 'MD5',
                       paySign: res.data.paySign,
                       success (res) {
                         console.log(res);
                        },
                       fail (res) {
                         console.log(res);
                        }
                     })
                    })
                  })
                }
               })
             }else{
               //用户未授权
             }
            }
          })
         }else
         {
          console.log('登录失败！' + res.errMsg)
         }
       
      }
    });
   
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
    let that = this;
    util.request(api.QueryCustomerServiceUrl,
      { openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,}
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.setData({
            customerList:res.data.customerList
          });
        }else{
          that.setData({
            customerList:[]
          });
        }
      });
      console.log(that.data.customerList)
      that.QuerySumCustomerPaymentList();
      that.QueryCustomerPaymentList();
    
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