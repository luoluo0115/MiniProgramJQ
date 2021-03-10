var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerInvoiceApplyList: [], //发票申请列表 
  },

  /**
   * 新增发票申请
   */
  goAddInvoiceApply(event) {
    let data = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/me/customerInvoiceApply/customerInvoiceApply?cust_invoice_apply_id=0"
    })
  },
  /**
   * 发票作废申请
  */
  goScarp(event){
    let data = event.currentTarget.dataset.item;
    let cust_invoice_apply_id = data.cust_invoice_apply_id;
    wx.navigateTo({
      url: "/pages/me/customerInvoiceScrapApply/customerInvoiceScrapApply?cust_invoice_apply_id=" + cust_invoice_apply_id
    })
  },
  /**
   * 发票详情
   */
  goDetail(event) {
    let data = event.currentTarget.dataset.item;
    let cust_invoice_apply_id = data.cust_invoice_apply_id;
    wx.navigateTo({
      url: "/pages/me/customerInvoiceInfoDetail/customerInvoiceInfoDetail?cust_invoice_apply_id=" + cust_invoice_apply_id
    })
  },

  /**
   * 删除发票信息
   */
  deleteApply(e) {
    var self = this;
    var item = e.currentTarget.dataset.item;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          var deleteData = {
            cust_invoice_apply_id: item.cust_invoice_apply_id,
            cid: customer_info_id
          };
          console.log(deleteData)
          util.request(api.BillApi.DeleteInvoiceApplyByID, deleteData, 'POST').then(function (res) {
            if (res.data.success == true) {
              self.QueryInvoiceApplyList();
              Toast.success("删除成功");
            } else {
              Toast.fail(res.data.msg);
            }
          })
        } else if (sm.cancel) {}
      }
    })
  },

  /**
   * 发票申请提交
   */
  InvoiceSubmit(e) {
    var self = this;
    var item = e.currentTarget.dataset.item;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    wx.showModal({
      title: '提示',
      content: '确认提交吗？',
      success: function (sm) {
        if (sm.confirm) {
          var postData = {
            cust_invoice_apply_id: item.cust_invoice_apply_id,
            cid: customer_info_id,
            ui: user_id,
            un: user_name
          };
          console.log(postData)
          util.request(api.BillApi.PostSubmitApplyS, postData, 'POST').then(function (res) {
            if (res.data.success == true) {
              self.QueryInvoiceApplyList();
              Toast.success("提交成功");
            } else {
              Toast.fail(res.data.msg);
            }
          })
        } else if (sm.cancel) {}
      }
    })
  },

  /**
   * 发票作废申请提交
  */
  scrapSubmitBtn(e){
    var self = this;
    var item = e.currentTarget.dataset.item;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    wx.showModal({
      title: '提示',
      content: '确认提交吗？',
      success: function (sm) {
        if (sm.confirm) {
          var postData = {
            cust_invoice_apply_id: item.cust_invoice_apply_id, 
            ui: user_id,
            un: user_name
          };
          console.log(postData)
          util.request(api.BillApi.PostInvoiceScarpSUrl, postData, 'POST').then(function (res) {
            if (res.data.success == true) {
              self.QueryInvoiceApplyList();
              Toast.success("提交成功");
            } else {
              Toast.fail(res.data.msg);
            }
          })
        } else if (sm.cancel) {}
      }
    })
  },

  /**
   * 编辑
   */
  goEdit(event) {
    let data = event.currentTarget.dataset.item;
    let cust_invoice_apply_id = data.cust_invoice_apply_id;
    wx.navigateTo({
      url: "/pages/me/customerInvoiceApply/customerInvoiceApply?cust_invoice_apply_id=" + cust_invoice_apply_id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.QueryInvoiceApplyList();
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
    var that = this;
    that.QueryInvoiceApplyList();
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
   * 查询开票申请  
   */
  QueryInvoiceApplyList: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let customer_name = app.globalData.curr_customer_name;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.BillApi.QueryCustInvoiceApplyListAllUrl, {
      cid: customer_info_id,  
      curr_month: curr_month,
      cname: customer_name,
      invoice_category: '',
      creation_date: '',
      oper_category: '',
      status: '',
      pageSize: 100,
      pageIndex: 1,
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        that.setData({
          customerInvoiceApplyList: res.data.list,
        });
      } else {
        that.setData({
          customerInvoiceApplyList: [],
          msg: '暂无发票申请数据！'
        });
      }
    })
  },
})