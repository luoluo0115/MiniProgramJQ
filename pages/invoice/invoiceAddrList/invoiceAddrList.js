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
    let im_cust_customer_id = data.im_cust_customer_id;
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
            im_cust_express_id: item.im_cust_express_id,
            cid:customer_info_id,
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
  /**
   * 查询快递地址
   */
  QueryCustExpress: function () {
    let that = this;
    let im_cust_customer_id =that.data.im_cust_customer_id;
    let customer_info_id = app.globalData.curr_customer_info_id;    
    let curr_month = app.globalData.curr_date.replace("-","");
    util.request(api.BillApi.GetCustExpressAllList, {
      cid: customer_info_id,
      customer_name:"",
      curr_month: curr_month,
      pageIndex:1,
      pageSize:100,      
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        that.setData({
          ExpressList: res.data.dt,
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
    that.QueryCustExpress();
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