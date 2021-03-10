var app = getApp()
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceScrapList: [],
    im_cust_req_master_id: 0,
    im_cust_inv_info_id: 0,
    im_cust_req_scrap_id: 0,
    showScrap: false,
    scrap_reason: '',
    remark: '',
    scrap_category:'作废',
    scrapCategoryList: [{      
      name: '作废'
    }, {       
      name: '红冲'
    }]
  },

  QueryImCustReqScrap: function () {
    let that = this;
    util.request(api.BillApi.QueryImCustReqScrap, {
      openid: app.globalData.openid,
      cid: app.globalData.curr_customer_info_id,
      im_cust_req_master_id: that.data.im_cust_req_master_id,
      pageSize: 100,
      pageIndex: 1
    }, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success == true) {
        that.setData({
          invoiceScrapList: res.data.invoiceScrapList
        });
      } else {
        that.setData({
          invoiceScrapList: []
        });
      }
    })
  },
  downInvoiceFile: function (e) {
    var that = this;
    let item = e.currentTarget.dataset.item;
    let invoice_file_guid = item.invoice_file_guid;
    wx.showLoading({
      title: '下载中...',
    });    
    wx.downloadFile({
      url: api.FileOssUrl+invoice_file_guid,
      success: function (res) {
        const tempFilePath = res.tempFilePath;        
        // 保存文件
        wx.saveFile({
          tempFilePath,
          success: function (res) {
            wx.hideLoading();
            const savedFilePath = res.savedFilePath;
            Toast('下载成功')
            // 打开文件
            wx.openDocument({
              filePath: savedFilePath,
              success: function (res) {
                console.log('打开文档成功')
              },
            });
          },
          fail: function (err) {    
            wx.hideLoading();        
            Toast('保存失败');           
          }
        });
      },
      fail: function (err) {    
        wx.hideLoading();    
        Toast('下载失败');        
      },
    });
  },
  //关闭弹窗
  closeScrap: function () {
    this.setData({
      showScrap: false
    })
  },
  scrapApplyDiv: function (e) {
    var that = this;
    let item = e.currentTarget.dataset.item;
    let im_cust_inv_info_id = e.currentTarget.dataset.im_cust_inv_info_id;
    that.setData({
      showScrap: true,
      im_cust_inv_info_id: im_cust_inv_info_id,
      im_cust_req_scrap_id: item.im_cust_req_scrap_id,
    })
  },
  handleFieldChange: function (e) {
    let that = this;
    let fieldname = e.currentTarget.dataset.fieldname
    let newValue = e.detail;
    that.setData({
      [fieldname]: newValue.replace(/\s+/g, ''),
    })
  },
  bindScrapCategoryChange: function (e) {    
    this.setData({
      scrap_category: this.data.scrapCategoryList[e.detail.value].name,
    })
  },
  postScrapApply: function (e) {
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
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    let im_cust_req_master_id = that.data.im_cust_req_master_id;
    let im_cust_inv_info_id = that.data.im_cust_inv_info_id;
    let im_cust_req_scrap_id = that.data.im_cust_req_scrap_id;
    let scrap_reason = that.data.scrap_reason;
    let scrap_category = that.data.scrap_category;
    let remark = that.data.remark;
    if (scrap_reason == null || scrap_reason == "" || scrap_reason.length <= 0) {
      Toast("请输入作废理由");
      return
    }
    wx.showLoading({
      title: "提交中...",
      mask: true,
    })
    let formData = {
      cid: customer_info_id,
      curr_month: curr_month,
      ui: user_id,
      un: user_name,
      im_cust_req_master_id: im_cust_req_master_id,
      im_cust_inv_info_id: im_cust_inv_info_id,
      im_cust_req_scrap_id: im_cust_req_scrap_id,
      scrap_reason: scrap_reason,
      scrap_category:scrap_category,
      remark: remark,
    };
    util.request(api.BillApi.PostImCustReqScrap, formData, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.data.success == true) {
        Toast.success(res.data.msg);
        that.QueryImCustReqScrap();
        that.setData({
          showScrap: false,
        })
      } else {
        Toast.fail(res.data.msg);
      }
    })
  },
  /**
   * 作废申请取消
   */
  scrapApplyCancel: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    wx.showModal({
      title: '提示',
      content: '确认取消发票作废申请吗？',
      success: function (sm) {
        if (sm.confirm) {
          var CancelData = {
            im_cust_req_scrap_id: item.im_cust_req_scrap_id,
            cid: customer_info_id,
            ui: user_id,
            un: user_name
          };
          util.request(api.BillApi.PostImCustReqScrapCancel, CancelData, 'POST').then(function (res) {
            if (res.data.success == true) {
              that.QueryImCustReqScrap();
              Toast.success(res.data.msg);
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
    let im_cust_req_master_id = options.im_cust_req_master_id;
    if (options.im_cust_req_master_id) {
      that.setData({
        im_cust_req_master_id: im_cust_req_master_id,
      });
    }
    that.QueryImCustReqScrap();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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