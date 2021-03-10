var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceCustList: {
      im_cust_customer_id: 0,
      customer_name: '',
      customer_tax_code: '',
      customer_bank_name: '',
      customer_bank_account: '',
      customer_phone: '',
      customer_address: '',
      remark: ''
    },
    fType: 0, //页面来源 0-客户维护页面 1-开票申请页面
  },

  handleFieldChange: function (e) {
    let that = this;
    let fieldName = e.currentTarget.dataset.fieldname
    let newValue = e.detail.value;

    let field = 'invoiceCustList.' + fieldName;
    this.setData({
      [field]: newValue,
    })
  },

  bindSave: function (e) {
    if (this.data.payButtonClicked) {
      wx.showToast({
        title: '休息一下~',
        icon: 'none'
      })
      return
    }
    this.data.payButtonClicked = true
    setTimeout(() => {
      this.data.payButtonClicked = false
    }, 1000)
    // 防止连续点击--结束
    const that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_name = app.globalData.user_name;

    let im_cust_customer_id = that.data.invoiceCustList.im_cust_customer_id;
    let customer_name = that.data.invoiceCustList.customer_name;
    let customer_tax_code = that.data.invoiceCustList.customer_tax_code;
    let customer_bank_name = that.data.invoiceCustList.customer_bank_name;
    let customer_bank_account = that.data.invoiceCustList.customer_bank_account;
    let customer_phone = that.data.invoiceCustList.customer_phone;
    let customer_address = that.data.invoiceCustList.customer_address;
    let remark = that.data.invoiceCustList.remark;

    if (customer_name == null || customer_name == undefined || customer_name.length <= 0) {
      Toast('请输入客户名称');
      return;
    }
    if (customer_tax_code == null || customer_tax_code == undefined || customer_tax_code.length <= 0) {
      Toast('请输入税务代码');
      return;
    }
    let formData = {
      im_cust_customer_id: im_cust_customer_id,
      customer_info_id: customer_info_id,
      customer_name: customer_name,
      customer_tax_code: customer_tax_code,
      customer_bank_name: customer_bank_name,
      customer_bank_account: customer_bank_account,
      customer_phone: customer_phone,
      customer_address: customer_address,
      remark: remark,
    };
    util.request(api.BillApi.PostInvoiceCust, {
      formCustData: formData,
      cid: customer_info_id,
      curr_month: curr_month,
      user_name: user_name
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        Toast.success(res.data.msg);
        if (that.data.fType == 1) {                    
          let pages = getCurrentPages();
          let currentPage = null; //当前页面
          let prevPage = null; //上一个页面
          if (pages.length >= 2) {
            currentPage = pages[pages.length - 1];
            prevPage = pages[pages.length - 2];
          }
          if (prevPage) {
            let custCustomerList = prevPage.data.custCustomerList;
            prevPage.setData({
              ['custCustomerList.customer_name']: customer_name,
              ['custCustomerList.customer_tax_code']: customer_tax_code,
              ['custCustomerList.customer_bank_name']: customer_bank_name,
              ['custCustomerList.customer_bank_account']: customer_bank_account,
              ['custCustomerList.customer_phone']: customer_phone,
              ['custCustomerList.customer_address']: customer_address,              
            })
          }
          wx: wx.navigateBack({
            delta: 1,
          })
        } else {
          wx.redirectTo({
            url: '/pages/invoice/invoiceInfo/invoiceInfo',
          })
        }
      } else {
        Toast.fail(res.data.msg);
      }
    })

  },
  /**
   * 删除客户信息
   */
  deleteCust: function (e) {
    var self = this;
    let im_cust_customer_id = self.data.invoiceCustList.im_cust_customer_id;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    if (im_cust_customer_id == null || im_cust_customer_id == undefined || im_cust_customer_id <= 0) {
      Toast('删除失败');
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          var deleteData = {
            im_cust_customer_id: im_cust_customer_id
          };
          util.request(api.BillApi.DeleteInvoiceCust, deleteData, 'POST').then(function (res) {
            if (res.data.success == true) {
              Toast.success("删除成功");
              wx.redirectTo({
                url: '/pages/invoice/invoiceInfo/invoiceInfo',
              })
            } else {
              Toast.fail(res.data.msg);
            }
          })
        } else if (sm.cancel) {}
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
      let fType = options.fType;
      that.setData({
        invoiceCustList: JSON.parse(data),
        fType: fType,
      });
      wx.setNavigationBarTitle({
        title: '编辑开票抬头'
      });
    } else {
      wx.setNavigationBarTitle({
        title: '新增开票抬头'
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

  },

})