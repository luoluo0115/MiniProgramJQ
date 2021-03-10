var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curr_payment_vat: 0, //                           增值税
    local_education_supplementary_tax: 0, //          地方教育费附加
    education_supplementary_tax: 0, //                  教育费附加
    city_construction_tax: 0, //                        城市维护建设税
    curr_income_tax: 0, //                              企业所得税 
    total_tax: 0, //                                    应缴税款总额
    amount_tax: 0,
    dtIndividualtax:[],//个人生产经营个税
    query_month:'',//月份
    cid:0,//客户ID,
    isConfirmPay:false,
  },
  /**
   * 应缴税款查询
   */
  QueryTaxPayable: function (e) {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let cid = that.data.cid;
    let account_month = that.data.query_month.split('-').join("");
    util.request(api.QueryTaxPayableUrl, {
      openid: app.globalData.openid,
      cid: cid,
      account_month: account_month
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        let data = res.data;
        that.setData({
          recv_status:data.recv_status,
          is_tax_confirm:data.is_tax_confirm,
          total_tax: data.total_tax,
          amount_tax: data.amount_tax,
          curr_payment_vat: data.curr_payment_vat,
          local_education_supplementary_tax: data.local_education_supplementary_tax,
          education_supplementary_tax: data.education_supplementary_tax,
          city_construction_tax: data.city_construction_tax,
          curr_income_tax: data.curr_income_tax,
          dtIndividualtax: res.data.dtIndividualtax,
        });
      } else {
        that.setData({
          recv_status:'',
          is_tax_confirm:'',
          total_tax: 0,
          amount_tax: 0,
          curr_payment_vat: 0,
          local_education_supplementary_tax: 0,
          education_supplementary_tax: 0,
          city_construction_tax: 0,
          curr_income_tax: 0,
          dtIndividualtax:[],
        });
      }
    })
  },
  //缴款确认
  AffirmTaxPay: function (e) {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let promotion_coupon_user_id = that.data.promotion_coupon_user_id;
    wx.showModal({
      title: '提示',
      content: '确定已经缴款吗？',
      success: function (sm) {
        if (sm.confirm) {
          that.setData({
            payDisabled: true
          })
          wx.showLoading({
            title: "缴款确认中...",
            mask: true,
          })
          util.request(api.BillApi.PostAffirmTaxPay, {
            cid: customer_info_id,
            curr_month: curr_month,
            ui: user_id,
            coupon: promotion_coupon_user_id,
          }, 'POST').then(function (res) {
            if (res.data.msg == 'Y') {
              Toast("确认成功");
            } else {
              Toast(res.data.msg);
            }
            that.setData({
              payDisabled: false,
              showTax: false,
            })
          })
          wx.hideLoading();
        } else if (sm.cancel) {}
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cid = options.cid;
    let cdate = options.cdate;
    if(cdate)
    {
      this.setData({
        query_month: cdate,
        cid:cid,
      })
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
    this.QueryTaxPayable();
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