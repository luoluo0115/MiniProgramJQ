var app = getApp()
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contractList: [],
  },

  QueryMyContract: function () {
    let that = this;
    util.request(api.QueryMyContract, {
      openid: app.globalData.openid,
      cid: app.globalData.curr_customer_info_id,
      pageSize: 100,
      pageIndex: 1
    }, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success == true) {
        that.setData({
          contractList: res.data.list
        });
      } else {
        that.setData({
          contractList: []
        });
      }
    })
  },
  archiveFile: function (e) {
    var item = e.currentTarget.dataset.item;
    wx.downloadFile({
      url: api.FileOssUrl + item.archive_file_guid,
      success: function (res) {
        console.log(res, 'previewPDF')
        const filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          success: function (res) {}
        })
      }
    });
  },
  //回签查看
  seeF: function (e) {
    var item = e.currentTarget.dataset.item;
    let e_flow_Id = item.e_flow_Id;

    util.request(api.PostContractFlowFile, {
      openid: app.globalData.openid,
      cid: app.globalData.curr_customer_info_id,
      flowid: e_flow_Id
    }, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success == true) {
        let url = res.data.url;
        wx.downloadFile({
          url: url,
          success: function (res) {
            console.log(res, 'previewPDF')
            const filePath = res.tempFilePath;
            wx.openDocument({
              filePath: filePath,
              success: function (res) {}
            })
          }
        });
      }
    })
  },
  //待签查看
  see: function (e) {
    var item = e.currentTarget.dataset.item;
    let e_file_Id = item.e_file_Id;

    util.request(api.PostContractFile, {
      openid: app.globalData.openid,
      cid: app.globalData.curr_customer_info_id,
      fileid: e_file_Id
    }, 'POST').then(function (res) {
      console.log(res)
      if(res.data.success==true){
        let url =res.data.url;
        wx.downloadFile({
          url: url,
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
      }
    })
  },
  //签约
  sign: function (e) {
    var item = e.currentTarget.dataset.item;
    let e_flow_Id = item.e_flow_Id;
    let e_account_Id = item.e_account_Id;
    let e_org_Id = item.e_org_Id;

    util.request(api.PostSignContractUrl, {
      openid: app.globalData.openid,
      cid: app.globalData.curr_customer_info_id,
      flowid: e_flow_Id,
      accountid: e_account_Id,
      orgid: e_org_Id,
    }, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success == true) {
        let url = res.data.url;
        wx.navigateTo({
          url: '../../me/contractWebView/contractWebView?url=' + url,
          success: function () {},
          fail: function () {},
          complete: function () {}
        })
      } else {
        Toast("未找到签约文件!");
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
    let that = this;
    that.QueryMyContract();
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