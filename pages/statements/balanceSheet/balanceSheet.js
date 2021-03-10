// pages/statements/balanceSheet/balanceSheet.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balancesheetdata:[],
    balancesheetdatadetail:[],
    incomesheetdetaildata:[]

  },
  /**
   * 资产负债表查询
   */
  QueryBalanceSheet:function(e){
    let that = this;
      util.request(api.QueryBalanceSheetUrl,{
        openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
        account_month:app.globalData.curr_date.split('-').join("")
    },'POST').then(function(res){

      console.log(res.data.balancesheetdata,'资产负债表列表')
          that.setData({
            balancesheetdata: res.data.balancesheetdata
          });
          app.globalData.cur_type_item=res.data.balancesheetdata.type_item
    })
  },
  //资产负债表详情查询
  QueryBalanceSheetDetail:function(e){
    
    let that = this;
    util.request(api.QueryBalanceSheetDetailUrl,{
      openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      account_month:app.globalData.curr_date.split('-').join(""),
      item_type:app.globalData.item_type
  },'POST').then(function(res){

    console.log(res.data.balancesheetdatadetail,'资产负债表明细')
    that.setData({
      balancesheetdatadetail: res.data.balancesheetdatadetail
    });
  })
    
  },
  QueryBalanceSheetDetail:function(item_type){
    console.log(item_type,'获取类型');
    let that = this;
    

    util.request(api.QueryBalanceSheetDetailUrl,{
      openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      account_month:app.globalData.curr_date.split('-').join(""),
      item_type:item_type
  },'POST').then(function(res){

    console.log(res,'负债表详情');
    if(res.data.success==true){
      that.setData({
        balancesheetdatadetail:res.data.balancesheetdatadetail
      });
    }else{
      that.setData({
        balancesheetdatadetail:[]
      });
    }
  })
    
  },
  /*点击资产负债表详情*/
  
  btnclick:function(e){
    var item_type=e.currentTarget.dataset.item_type;
    var index=e.currentTarget.dataset.index;
    //console.log(index);
    if(index==0){
      if(item_type!='C'&item_type!='F'&item_type!='H'){
        this.QueryBalanceSheetDetail(item_type);
      }else{
        this.setData({
          balancesheetdatadetail:[]
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
    this.setData({
      date:  app.globalData.curr_date,
    });
    this.QueryBalanceSheet();
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