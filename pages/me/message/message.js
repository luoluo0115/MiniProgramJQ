var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:"",
    dataSourceList: [], //消息分类
    message_source:'',
    MessageList:[],//消息列表
   
    active:0,
  },
  onChange(event) {
    console.log(event, 'event')
    let that = this;
    let title = event.detail.title;
    that.setData({
      message_source:title
    })
    that.RefreshMessage();
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
     
    this.QueryMessageSource();
    
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
   * 查询消息分类
   */
  QueryMessageSource: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    util.request(api.QueryMessageSource, {
      cid: customer_info_id,
      curr_month: curr_month
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          dataSourceList: res.data.list,
          message_source: res.data.list[0].code_no,
        });
        that.RefreshMessage();
      } else {
        that.setData({
          dataSourceList: [],
          message_source:'',
        });
      }
    })

  },
  /**
   * 查询消息列表
   */
  RefreshMessage: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let user_id = app.globalData.user_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    let message_source =that.data.message_source;
    util.request(api.RefreshMessage, {
      cid: customer_info_id,
      curr_month: curr_month,
      ui:user_id,
      message_source:message_source,
      pageSize:100,
      pageIndex:1
    }, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success == true) {
        that.setData({
          MessageList: res.data.list,
        });
      } else {
        that.setData({
          MessageList: [],
          msg:"暂无数据"
        });
      }
    })

  },
  /**
   * 阅读消息
   */
  readMessage: function (e) {
    let that = this;
    let message_user_id = e.currentTarget.dataset.message_user_id
    let customer_info_id = app.globalData.curr_customer_info_id;
    let user_id = app.globalData.user_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    util.request(api.ReadMessageById, {
      cid: customer_info_id,
      curr_month: curr_month,
      ui:user_id,
      message_user_id:message_user_id,
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
         that.RefreshMessage();
      }
    })

  },
})