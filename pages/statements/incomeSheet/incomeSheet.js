// pages/statements/incomeSheet/incomeSheet.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexType:0,
    incomesheetdetaildata:[],
    incomesheetdata:[]
  },
  /**
   * 利润表查询
   */
  QueryIncomeSheet:function(e){
    let that = this;
    util.request(api.QueryIncomeSheetUrl,{
      openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
        account_month:app.globalData.curr_date.split('-').join("")
  },'POST').then(function(res){
    if(res.data.success==true){
      that.setData({
        incomesheetdata: res.data.incomesheetdata
      });
    }else{
      that.setData({
        incomesheetdata:[]
      });
    }
   
  })

  },
  QueryIncomeSheetDetail:function(item_type){
    let that = this;
    
    console.log(item_type,'获取类型');
    
    util.request(api.QueryIncomeSheetDetailUrl,{
      openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
        account_month:app.globalData.curr_date.split('-').join(""),
        item_type:item_type
  },'POST').then(function(res){

    console.log(res.data.incomesheetdetaildata,'利润详情');
    if(res.data.success==true){
      that.setData({
        incomesheetdetaildata:res.data.incomesheetdetaildata
      });
    }else{
      that.setData({
        incomesheetdetaildata:[]
      });
    }
  })
    
  },
  btnclick:function(e){
    var item_type=e.currentTarget.dataset.item_type;
    var index=e.currentTarget.dataset.index;
    //console.log(index);
    if(index==0){
      if(item_type!='D'){
        this.QueryIncomeSheetDetail(item_type);
      }else{
        this.setData({
          incomesheetdetaildata:[]
  
        });
      }
     
      index=1;
      
    }
console.log(index);
    
    
  },
  onChange(event,type) {
    //console.log(incomesheetdata,'点击');
    const { key } = event.currentTarget.dataset;
    this.setData({
      [key]: event.detail
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
    this.QueryIncomeSheet();
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