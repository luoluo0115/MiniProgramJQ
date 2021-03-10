// pages/me/payRecord/payRecord.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    custAccountTrans:'',
    NoData:'',
  },
  /**
   * 交易记录
   */
  QueryCustAccountTrans:function() {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    let postData={
      openid:app.globalData.openid,cid:customer_info_id,ui: app.globalData.user_id
    }
    util.request(api.QueryCustAccountTrans,
      postData
      ,'POST').then(function(res){
        console.log(res,'res')
        if(res.data.success==true){
          that.setData({
            custAccountTrans:res.data.custAccountTrans,
            NoData:'',
          });
        }else{
          that.setData({
            custAccountTrans:'',
            NoData:'暂无数据',
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
    this.QueryCustAccountTrans()
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