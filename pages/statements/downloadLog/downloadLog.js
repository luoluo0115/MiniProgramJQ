// pages/statements/downloadLog/downloadLog.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_year: '',
    LogList: [],
    showloading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      account_year: util.formatYear(),
    })
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
    this.QueryDownloadLog()
  },
  /**
   * 日期选择起始
   */
  bindDateChange: function (e) {
    this.setData({
      account_year: e.detail.value,
    });

  },
  /**
   * 查询数据
   */
  QueryDownloadLog: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let postData = {
      cid: customer_info_id,
      ui: app.globalData.user_id,
      type: 'F',
    }
    util.request(api.BillApi.QueryDownloadLogUrl, postData, 'POST').then(function (res) {
      console.log(res, 'res')
      if (res.data.success == true) {
        that.setData({
          LogList: res.data.logList,
        });
      } else {
        that.setData({
          LogList: []
        });
      }
    })

  },
  /**
   * 年度账册生成下载记录
   */
  btnPDF: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let user_name = app.globalData.user_name;
    let curr_customer_name = app.globalData.curr_customer_name
    let file_name = '年度账册_' + curr_customer_name + '_' + that.data.account_year + '';
    let postData = {
      cid: customer_info_id,
      user_id: app.globalData.user_id,
      user_name: user_name,
      file_category: 'F',
      file_name: file_name
    }
    console.log(postData, 'postData')
    util.request(api.BillApi.UploadPDFUrl, postData, 'POST').then(function (res) {
      console.log(res, 'res')
      if (res.data.success == true) {
        Toast(res.data.msg);
        that.QueryDownloadLog()
      } else {
        Toast(res.data.msg);
      }
    })

  },

  DownPDFYearAccountReport: function (event) {
    console.log(event, 'event')
    let download_log_id = event.target.dataset.account_data_download_log_id
    wx.showLoading()
    let customer_info_id = app.globalData.curr_customer_info_id;
    if (customer_info_id > 0) {
      let postData = {
        year: this.data.account_year,
        cid: customer_info_id,
        cname: app.globalData.curr_customer_name,
        user_id: app.globalData.user_id,
        user_name: app.globalData.user_name,
        download_log_id: download_log_id
      }
      wx.request({
        url: api.BillApi.DownPDFYearAccountReportUrl,
        data: postData,
        header: {
          "content-type": "application/json",
          'Authorization': 'Bearer ' + wx.getStorageSync('qh_access_token'), //设置验证
        },
        method: "get",
        dataType: "json",
        responseType: "arraybuffer",
        success: (result) => {
          console.log("下载成功！", result);
          if (result.success == false) {
            wx.showToast({
              title: result.msg,
              icon: 'none',
              duration: 2000,
            })
          } else {
            var fileManager = wx.getFileSystemManager();
            var FilePath = wx.env.USER_DATA_PATH + "/" + new Date().getTime() + ".pdf";
            fileManager.writeFile({
              data: result.data,
              filePath: FilePath,
              encoding: "binary", //编码方式 
              success: result => {
                wx.openDocument({ //成功之后直接打开
                  filePath: FilePath,
                  showMenu: true,
                  fileType: "pdf",
                  success: result => {
                    console.log("打开文档成功");
                  },
                  fail: err => {
                    console.log("打开文档失败", err);
                  }
                });
                wx.hideLoading();
              },
              fail: res => {
                wx.showToast({
                  title: '下载失败!',
                  icon: 'none',
                  duration: 2000,
                })
                console.log(res);
              }
            })
            wx.hideLoading()
          }
        },
        fail(err) {
          console.log(err)
          wx.hideLoading()
        }

      })
    } else {
      wx.showToast({
        title: '请选择客户后下载报表!',
        icon: 'none',
        duration: 2000,
      })
    }
  },

  DownPDF: function (e) {
    var item = e.currentTarget.dataset.item;
    wx.downloadFile({
      url: api.FileOssUrl + item.file_name_guid,
      success: function (res) {
        console.log(res, 'previewPDF')
        const filePath = res.apFilePath;
        wx.openDocument({
          filePath: filePath,
          showMenu: true,
          fileType: "pdf",
          success: result => {
            console.log("打开文档成功");
          },
          fail: err => {
            console.log("打开文档失败", err);
          }
        });
      }
    });
  },
})