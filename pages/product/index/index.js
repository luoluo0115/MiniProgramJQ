// pages/product/index/index.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
import Toast from '../../../vant-weapp/dist/toast/toast';

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicationDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    bannerList: [],
    productList: [],
    curr_customer_info_id: '',
    customer_info_id: '',
    curr_date: util.LastMonth(new Date()),
    showofficial: false,
    imgUrlsofficial: api.ImgUrl + 'A008',
    is_follow_official_account: '', //是否关注公众号
  },
  //关闭公众号
  onOfficialClose() {
    this.setData({
      showofficial: false
    });
  },
  //关注公众号
  followBtn: function () {
    wx.navigateTo({
      url: "/pages/home/officialAccount/officialAccount",
      //url: "/pages/home/taxPayable/taxPayable?cid=9084&cdate=202101",
    });
  },
  goBanner(e) {
    let item = e.currentTarget.dataset.item;
    let jump_url = item.jump_url
    if (jump_url) {
      wx.navigateTo({
        url: jump_url
      })
    }
  },
  //获取轮播图
  QuerySpreadFocusList: function () {
    let that = this;
    util.request(api.QuerySpreadFocusUrl, {
      openid: app.globalData.openid,
      cid: "0"
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          bannerList: res.data.spreadImg,
        });

      } else {
        that.setData({
          bannerList: []
        });
      }
    })


  },
  //获取前置产品列表
  QueryPreProductList: function () {
    let that = this;
    util.request(api.QueryPreProductListUrl, //获取前置产品列表
      {
        openid: app.globalData.openid,
        pre_product_id: "0"
      }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          productList: res.data.productList,
        });
        console.log(res.data.productList, 'res.data.productList')

      } else {
        that.setData({
          productList: []
        });
      }
      wx.stopPullDownRefresh();
    })


  },
  bindTapProductDetail: function (event) {
    let product_id = event.currentTarget.dataset.product_id
    wx.navigateTo({
      url: '../productDetail/productDetail?product_id=' + product_id
    })
  },
  bindTapProductList: function (event) {
    let product_id = event.currentTarget.dataset.product_id;
    let item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../productList/productList?product_id=' + product_id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取分享推荐码
    console.log(options, '服务商城加载参数')
    var parent_referral_code = options.referral_code;
    if (parent_referral_code != undefined && parent_referral_code != null && parent_referral_code != "") {
      wx.setStorageSync('parent_referral_code', parent_referral_code);
    }
    console.log(wx.getStorageSync('parent_referral_code'), 'parent_referral_code')
    app.globalData.curr_date = this.data.curr_date;
    //app.globalData.index = this.data.index;
    let index = app.globalData.index;
    if (app.globalData.customer_info_id_list != '') {
      app.globalData.curr_customer_info_id = app.globalData.customer_info_id_list[index].customer_info_id;
      app.globalData.curr_customer_name = app.globalData.customer_info_id_list[index].customer_name;
    } else {
      app.globalData.curr_customer_info_id = 0;
      app.globalData.curr_customer_name = '';
    }
  },
  goCustrom: function () {

  },
  /**
   * 查询所有公司列表
   */
  QueryUserCustomerList: function (e) {
    let that = this;
    let index = app.globalData.index;
    util.request(api.QueryUserCustomerListUrl, //查询所有公司列表
      {
        openid: app.globalData.openid
      }, 'POST').then(function (res) {
      if (res.data.success == true) {
        app.globalData.customer_info_id_list = res.data.customerList;
        app.globalData.curr_customer_info_id = res.data.customerList[index].customer_info_id;
        app.globalData.curr_customer_name = res.data.customerList[index].customer_name;
        app.globalData.user_info = res.data.uInfo;
        var is_follow_official_account = res.data.uInfo.is_follow_official_account;
        if (is_follow_official_account == "N") {
          that.setData({
            showofficial: true,
          })
        }
      } else {
        app.globalData.customer_info_id_list = [];
        app.globalData.curr_customer_info_id = 0;
        app.globalData.curr_customer_name = '';
      }
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
    this.QuerySpreadFocusList();
    this.QueryPreProductList();
    this.QueryUserCustomerList();
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
    this.QuerySpreadFocusList();
    this.QueryPreProductList();
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
    let user_id = app.globalData.user_id
    let referral_code = wx.getStorageSync("referral_code");
    return {
      title: '巧记账',
      path: '/pages/index/index?referral_code=' + referral_code + '&user_id=' + user_id,
    }
  }
})