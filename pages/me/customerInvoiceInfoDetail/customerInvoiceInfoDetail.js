
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,
        isShowMore: false, //查看更多
        isShowMore2: false, //查看更多
        formData:{},
    },

    //展开
    moreChange: function () {
        let that = this;
        that.setData({
            isShowMore: !that.data.isShowMore
        })
    },
    moreChange2: function () {
      let that = this;
      that.setData({
          isShowMore2: !that.data.isShowMore2
      })
  },
  
  switchTab(event) {
    let that = this;
    let title = event.detail.title;
    if (title == '发票详情') { 
      wx.setNavigationBarTitle({
        title: '发票详情'
      });
    } else if (title == '发票作废') { 
      wx.setNavigationBarTitle({
        title: '发票作废'
      });
    }
  },
    /**
     * 获取单笔发票记录
    */
    GetCustomerInvoiceApplyByID:function(){
        var that = this;
        let customer_info_id = app.globalData.curr_customer_info_id; 
        let cust_invoice_apply_id = that.data.cust_invoice_apply_id;
        var data = {
          customer_info_id: customer_info_id, 
          cust_invoice_apply_id: cust_invoice_apply_id,
        }
        util.request(api.BillApi.QueryCustomerInvoiceApplyByIDUrl,
          data, 'POST').then(function (res) {
          console.log(res,'--------------------')
          if (res.data.success == true) {
            let customerInvoiceInfoList = res.data.info[0];  

            that.setData({
                formData: customerInvoiceInfoList, 
            });

          } 
        })  
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;  
        if (options.cust_invoice_apply_id) {
          that.setData({
            cust_invoice_apply_id: options.cust_invoice_apply_id,
          });
          that.GetCustomerInvoiceApplyByID();
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})