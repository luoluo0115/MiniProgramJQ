// pages/bill/salaryExcel/salaryExcel.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    processRuncard: {process_recv_info_id: 0, recv_status: ""},
    account_month : '',
    customer_info_name:''

  },
/**
   * 查询薪资数据
   */
  QuerySalary: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    util.request(api.BillApi.QueryMonthlySalary, {
      cid: customer_info_id,
      salary_month: curr_month
    }, 'POST').then(function (res) {
      console.log(res,'工资')
      that.setData({
        processRuncard : {
          process_recv_info_id: 0, recv_status: ""
        }
      });
      if (res.data.success == true) {
        that.setData({
          salaryList: res.data.salaryData,
          processRuncard: res.data.processRuncard[0]
        });
      } else {
        that.setData({
          salaryList: []
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
    this.setData({
      account_month : app.globalData.curr_date,
      curr_status: wx.getStorageSync('curr_status'),//当前做账状态
      customer_info_name:app.globalData.curr_customer_name
    });
    this.QuerySalary();
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
})