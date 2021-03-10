// pages/bill/tax/tax.js
// pages/bill/taxation/taxation.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PostWithTaxList: [],
    activeNames: ['0'],
  },
  onChangelist(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  /**
   * 进行认证查询
   */
  PostWithTaxFile: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.split('-').join("");;
    util.request(api.BillApi.PostWithTaxFile, {
      cid: customer_info_id,
      curr_month: curr_month,
      pageSize: 100,
      pageIndex: 1
    }, 'POST').then(function (res) {
      console.log(res, 'res')
      if (res.data.success == true) {
        that.setData({
          PostWithTaxlist: res.data.list,
        });
        console.log(that.data.PostWithTaxlist, 'PostWithTaxlist')

      } else {
        that.setData({
          PostWithTaxList: []
        });
      }
      console.log(that.data.PostWithTaxlist, 'PostWithTaxlist111')
    })

  },

  previewPDF: function (e) {
    var item = e.currentTarget.dataset.item;
    wx.downloadFile({
      url: api.FileOssUrl + item.file_name_guid,
      success: function (res) {
        console.log(res,'previewPDF')
        const filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          success: function (res) {

          }
        })
      }
    });
  },
  /**
   * 预览图片
   */
  previewImage: function (event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [imgList] // 需要预览的图片http链接列表
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
    this.PostWithTaxFile();
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