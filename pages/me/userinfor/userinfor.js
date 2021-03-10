// pages/me/userinfor/userinfor.js
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer_info_id: app.globalData.customer_info_id,
    customer_name: [],
    register_addr: [],
    actual_addr: [],
    tax_type: [],
    tax_levy_method: [],
    tax_code: [],
    legal_person: [],
    customer_in_charge_ext: [],
    customer_in_charge_name: [],
    enterprise_type: [],
    custContactList:[],//授权列表
  },

  QueryCustContact:function(){
    let that = this;
    util.request(api.QueryCustomerContactList,
      { openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,user_id:app.globalData.user_id,user_name:app.globalData.user_name}
      ,'POST').then(function(res){
        console.log(res)
        if(res.data.success==true){
          that.setData({
            custContactList:res.data.info
          });
        }else{
          that.setData({
            custContactList:[]
          });
        }
      })
  },
  /**
   * 删除薪资
   */
  CancelAuth: function (e) {
    var self = this;
    var item = e.currentTarget.dataset.item;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    wx.showModal({
      title: '提示',
      content: '确认取消该用户授权吗？',
      success: function (sm) {
        if (sm.confirm) {
          var Data = {
            customer_info_id: customer_info_id,
            user_name: user_name,
          };
          console.log(deleteData)
          util.request(api.PostCancelAuthorization, Data, 'POST').then(function (res) {
            if (res.data.success == true) {
              self.QueryCustContact();
              Toast.success("取消授权成功");
            } else {
              Toast.fail(res.data.msg);
            }
          })
        } else if (sm.cancel) {
        }
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
    let that = this;
    util.request(api.QueryCustomerListUrl,
      { openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,}
      ,'POST').then(function(res){
        if(res.data.success==true){
          var customerList=JSON.stringify(res.data.customerList);
          that.setData({
            customerList:res.data.customerList[0]
          });
          console.log(JSON.stringify(res.data.customerList)+"我的公司信息");
        }else{
          that.setData({
            customerList:[]
            
          });
        }
      })
    
    that.QueryCustContact();
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