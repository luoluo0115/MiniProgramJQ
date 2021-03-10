var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustVendorList: [], //销售方信息
  },

  handleFieldChange: function (e) {
    let that = this;
    let fieldName = e.currentTarget.dataset.fieldname
    let newValue = e.detail.value;

    let field = 'CustVendorList.' + fieldName;
    this.setData({
      [field]: newValue,
    })
  },
  /**
   * 保存
   */
  bindSave: function (e) {
    const that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_name = app.globalData.user_name;

    let im_cust_vendor_id = that.data.CustVendorList.im_cust_vendor_id;
    let vendor_name = that.data.CustVendorList.vendor_name;
    let vendor_address = that.data.CustVendorList.vendor_address;
    let vendor_phone = that.data.CustVendorList.vendor_phone;
    let remark = that.data.CustVendorList.remark;

    if (vendor_name == null || vendor_name == undefined || vendor_name.length <= 0) {
      Toast('请输入销方名称');
      return;
    }
    if (vendor_phone == null || vendor_phone == undefined || vendor_phone.length <= 0) {
      Toast('请输入销方电话');
      return;
    }

    let formData = {
      im_cust_vendor_id: im_cust_vendor_id,
      customer_info_id: customer_info_id,
      vendor_name: vendor_name,
      vendor_address: vendor_address,
      vendor_phone: vendor_phone,
      remark: remark,
      un: user_name,
    };
    util.request(api.BillApi.PostCustVendorCustomer, formData, 'POST').then(function (res) {
      if (res.data.success == true) {
        Toast.success(res.data.msg);
        let pages = getCurrentPages(); //获取所有页面
        let currentPage = null; //当前页面
        let prevPage = null; //上一个页面
        if (pages.length >= 2) {
          currentPage = pages[pages.length - 1]; //获取当前页面，将其赋值
          prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
        }
        if (prevPage) {
          prevPage.setData({
            ['CustVendorList.vendor_address']: vendor_address,
            ['CustVendorList.vendor_phone']: vendor_phone,
            ['CustVendorList.remark']: remark,
          })
        }
        wx.navigateBack({
          delta: 1,
        })
      } else {
        Toast.fail(res.data.msg);
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let data = options.data;
    if (options.data) {
      that.setData({
        CustVendorList: JSON.parse(data),
      });
    }
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

  }

})