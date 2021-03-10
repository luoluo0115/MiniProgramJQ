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
    productList: [],
    activeKey: 0,
    productBigCatList: [],
    indexList: 0,
    menuHeight: "", //菜单高度
    currentTab: 0, //预设当前项的值
    scrollTop: 0, //tab标题的滚动条位置
    product_id: '',
    serachvalue: ''
  },
  //搜索关键词
  onSearch(value) {
    let that = this;
    that.setData({
      serachvalue: value.detail
    })
    that.QueryPreProductList()

  },
  onClickNav({
    detail = {}
  }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },

  onClickItem({
    detail = {}
  }) {
    const {
      activeId
    } = this.data;
    const index = activeId.indexOf(detail.id);
    if (index > -1) {
      activeId.splice(index, 1);
    } else {
      activeId.push(detail.id);
    }
    this.setData({
      activeId
    });
  },
  //获取前置产品分类
  QueryPreProductCategory: function () {
    let that = this
    util.request(api.QueryPreProductCategoryUrl, //获取前置产品列表
      {
        openid: app.globalData.openid
      }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          productBigCatList: res.data.productBigCatList,
          product_big_cat: res.data.productBigCatList[0].product_category
        });

        that.QueryPreProductList()
      } else {
        that.setData({
          productBigCatList: []
        });
      }
    })
  },
  //获取前置产品列表
  QueryPreProductList: function () {
    let that = this;
    let postData = {
      openid: app.globalData.openid,
      pre_product_id: "0",
      product_Level: 2,
      parent_pre_product_id: that.data.product_id,
      product_big_cat: that.data.product_big_cat,
      serachvalue: that.data.serachvalue
    }    
    util.request(api.QueryPreProductListByLevelUrl, //获取前置产品列表
      postData, 'POST').then(function (res) {
      console.log(res, '获取前置产品列表')
      if (res.data.success == true) {
        that.setData({
          productList: res.data.productList,
        });
      } else {
        that.setData({
          productList: []
        });
      }
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let cur = e.currentTarget.dataset.current;    
    this.setData({
      indexList: cur,
      page_index: 1,
      listData: [],
      product_big_cat: this.data.productBigCatList[cur].product_category
    })
    this.QueryPreProductList();
    if (this.data.currentTab == cur) {
      return false;
    } else {
      wx.pageScrollTo({
        scrollTop: 0
      })
      this.setData({
        currentTab: cur,
        page_index: 1,
        listData: [],
      })
      this.checkCor();
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    let that = this;
    //这里计算按照实际情况进行修改，动态数据要进行动态分析
    //思路：窗体高度/单个分类高度 200rpx 转px计算 =>得到一屏幕所显示的个数，结合后台传回分类总数进行计算
    //数据很多可以多次if判断然后进行滚动距离计算即可
    if (that.data.currentTab > 7) {
      that.setData({
        scrollTop: 500
      })
    } else {
      that.setData({
        scrollTop: 0
      })
    }
  },
  bindTapProductDetail: function (event) {
    let product_id = event.currentTarget.dataset.product_id
    wx.navigateTo({
      url: '../productDetail/productDetail?product_id=' + product_id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    this.setData({
      product_id: options.product_id
    })
    this.QueryPreProductCategory()
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

})