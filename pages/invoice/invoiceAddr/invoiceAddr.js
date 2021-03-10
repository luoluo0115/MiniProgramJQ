var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ExpressList:[],
    im_cust_customer_id:0,//销售方客户ID
  },

  goAdd:function(event) {
    let type = event.currentTarget.dataset.type;
    let im_cust_customer_id = this.data.im_cust_customer_id;
    wx.navigateTo({
      url: "/pages/invoice/invoiceAddrAdd/invoiceAddrAdd?im_cust_customer_id="+im_cust_customer_id +"&type="+type
    })
  },
  goEdit:function(event) {
    let type = event.currentTarget.dataset.type;
    let data = event.currentTarget.dataset.item;
    let im_cust_customer_id = this.data.im_cust_customer_id;
    wx.navigateTo({
      url: "/pages/invoice/invoiceAddrAdd/invoiceAddrAdd?im_cust_customer_id="+im_cust_customer_id +"&type="+type+"&item="+JSON.stringify(data) 
    })
  },
  /**
   * 删除地址
   */
  deleteExp: function (e) {
    var self = this;
    var item = e.currentTarget.dataset.item;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    let user_id = app.globalData.user_id;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          var deleteData = {
            im_cust_express_id: item.im_cust_express_id
          };
          console.log(deleteData)
          util.request(api.BillApi.DelExpress, deleteData, 'POST').then(function (res) {
            if (res.data.success == true) {
              self.QueryCustExpress();
              Toast.success("删除成功");
            } else {
              Toast.fail(res.data.msg);
            }
          })
        } else if (sm.cancel) {
        }
      }
    })
  },
  expressChange:function(event){
    let data = event.currentTarget.dataset.item;    
    let pages = getCurrentPages();//获取所有页面
    let currentPage = null;   //当前页面
    let prevPage = null;  //上一个页面
    if (pages.length >= 2) {
      currentPage = pages[pages.length - 1]; //获取当前页面，将其赋值
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) {
      let formData = prevPage.data.formData; 
      prevPage.setData({         
        ['formData.im_cust_express_id']: data.im_cust_express_id,
        ['formData.express_address']: data.express_address,
        ['formData.express_contact_name']: data.express_contact_name,
        ['formData.express_contact_phone']: data.express_contact_phone,
        ['formData.province']: data.province,
        ['formData.city']: data.city,
        ['formData.district']: data.district,
      })
    }
    wx: wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 查询快递地址
   */
  QueryCustExpress: function () {
    let that = this;
    let im_cust_customer_id =that.data.im_cust_customer_id;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    util.request(api.BillApi.QueryCustExpress, {
      customer_info_id: customer_info_id,
      curr_month: curr_month,
      im_cust_customer_id:im_cust_customer_id
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        that.setData({
          ExpressList: res.data.listExpress,
        });
      } else {
        that.setData({
          ExpressList: []
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let im_cust_customer_id = options.im_cust_customer_id;
    if (options.im_cust_customer_id) {
      that.setData({
        im_cust_customer_id: options.im_cust_customer_id,
      });
    }    
    this.QueryCustExpress();
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
    this.QueryCustExpress();
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