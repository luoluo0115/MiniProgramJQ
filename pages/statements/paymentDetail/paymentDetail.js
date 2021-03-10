// pages/statements/paymentDetail/paymentDetail.js
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
    key_id:[],
    b_type:[],
    query_type:[],
    item_type:[],
    total:0,
    detailData: [],
  },
  QueryPaymentReceivableDetail: function(e){
    //账款明细信息
    let that = this;
    util.request(api.QueryPaymentReceivableDetailUrl,{
      openid:app.globalData.openid,
        customer_info_id:app.globalData.curr_customer_info_id,
        key_id: app.globalData.key_id,
        account_month:app.globalData.curr_date.split('-').join(""),
        query_type: app.globalData.query_type,
        b_type: app.globalData.b_type
  },'POST').then(function(res){
    console.log(res,'成功');
    if(res.data.success==true){
      var total=0;
      for(var i=0;i<res.data.detailData.length;i++){
        var amt_cr=res.data.detailData[i].amt_cr;
        var amt_dr=res.data.detailData[i].amt_dr;

        if(app.globalData.item_type=='pay'){
          total += amt_cr-amt_dr;
        }else{
          total += amt_dr-amt_cr;
          
        }
      }
      app.globalData.total =total;
      console.log(app.globalData.total,'总计');
      that.setData({
        detailData: res.data.detailData,
        total:app.globalData.total
      });
    }else{

      that.setData({
        detailData: [],
        total:0
        
    });
    }
  })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.key_id=options.key_id;
    app.globalData.b_type=options.b_type;
    app.globalData.query_type=options.query_type;
    app.globalData.item_type=options.item_type;
    console.log(app.globalData.item_type,'类型')
    wx.setNavigationBarTitle({
      title: options.title

    })
    this.setData({
      key_id: options.key_id,
      b_type: options.b_type,
      query_type: options.query_type,
      item_type:options.item_type

    });
    this.QueryPaymentReceivableDetail();
    
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