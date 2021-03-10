var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //机巧公众号
    officialAccountUrl: '',
  },

  QueryOfficialAccountUrl: function (e) {
    let that = this;
    util.request(api.QueryOfficialAccountUrl, {
      openid: app.globalData.openid
    }, 'POST').then(function (res) {
      let officialAccountUrl = 'https://mp.weixin.qq.com/s/TkMEm2mCEI4kJ1hP8L_Ezw';
      if (res.data.success == true) {
        officialAccountUrl = res.data.officialAccountUrl
        that.setData({
          officialAccountUrl: officialAccountUrl,
        })
      } else {
        that.setData({
          officialAccountUrl: officialAccountUrl,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.QueryOfficialAccountUrl();
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