// pages/bill/asset/asset.js
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
    monthlyDepreciationData:[],
    monthlyDepreciationDataTotal:[],
    depreciatedTotal:0.00,
    accTotal:0.00
  },

  onChange(event) {
    console.log(event,'event')
    let title=event.detail.title;
    if(title=='折旧汇总'){
      this.QueryAssetMonthlyDepreciationTotal();
    }else if(title=='固定资产折旧'){
      this.QueryAssetMonthlyDepreciation();
    }
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.name}`,
    //   icon: 'none',
    // });
  },
  onChangeFixedAssets(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  QueryAssetMonthlyDepreciation:function() {
    
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    console.log(customer_info_id,'customer_info_id')
    console.log(curr_month,'curr_month')
    util.request(api.QueryAssetMonthlyDepreciationUrl,
      {cid:customer_info_id,curr_month:curr_month}
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.setData({
            monthlyDepreciationData:res.data.monthlyDepreciationData
          });
          console.log(res.data.monthlyDepreciationData , "固定资产");
        }else{
          that.setData({
            monthlyDepreciationData:[]
          });
        }
      })
     
  },
  QueryAssetMonthlyDepreciationTotal:function() {
    
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.split('-').join("");;
    util.request(api.QueryAssetMonthlyDepreciationTotalUrl,
      {cid:customer_info_id,curr_month:curr_month}
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.setData({
            monthlyDepreciationDataTotal:res.data.monthlyDepreciationDataTotal
          });
          that.dataSum()
          console.log(res , "折旧资产汇总");
        }else{
          that.setData({
            monthlyDepreciationDataTotal:[]
          });
        }
      })
     
  },
dataSum: function() {
    let that=this;
    var depreciatedTotal = 0;
    var accTotal = 0
    if (that.data.monthlyDepreciationDataTotal.length > 0) {
    for (var i = 0; i < that.data.monthlyDepreciationDataTotal.length; i++) {
      depreciatedTotal += parseFloat((that.data.monthlyDepreciationDataTotal[i].depreciated_value).toFixed(2));
      accTotal += parseFloat((that.data.monthlyDepreciationDataTotal[i].acc_value).toFixed(2));
    }
    }
    depreciatedTotal = parseFloat(depreciatedTotal.toFixed(2));
    accTotal= parseFloat(accTotal.toFixed(2));
    that.setData({
      depreciatedTotal: depreciatedTotal,
      accTotal: accTotal
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
      this.QueryAssetMonthlyDepreciation();
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