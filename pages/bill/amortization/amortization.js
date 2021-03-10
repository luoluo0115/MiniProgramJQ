var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    activeNames: ['1'],
    MonthlyAmortizationData:[],
  },

  onChange(event) {
    let title=event.detail.title;
    if(title=='长期待摊(查阅)'){
      this.QueryEmMonthlyAmortization();
    } 
  },
  onChangeFixedAssets(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  QueryEmMonthlyAmortization:function() {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    util.request(api.BillApi.QueryEmMonthlyAmortization,
      {cid:customer_info_id,curr_month:curr_month}
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.setData({
            MonthlyAmortizationData:res.data.monthlyAmortization
          });
        }else{
          that.setData({
            MonthlyAmortizationData:[]
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
      this.QueryEmMonthlyAmortization();
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